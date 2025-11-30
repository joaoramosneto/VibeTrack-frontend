// Importações essenciais do Angular e PrimeNG
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // 1. Import para navegação
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast'; // 2. Módulo de Toast
import { MessageService } from 'primeng/api';

// Nossas importações personalizadas
import { ParticipanteService, ParticipanteRequest } from '../../layout/service/participante.service';

@Component({
  selector: 'app-cadastro-participante',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    ToastModule // Necessário para o <p-toast> funcionar
  ],
  template: `
    <!-- O componente Toast deve estar no template para exibir as mensagens -->
    <p-toast></p-toast>

    <div class="card">
      <h5>Cadastrar Novo Participante</h5>
      
      <div class="p-fluid grid mt-3">
        <div class="col-12">
          
          <div class="field flex flex-col mb-4">
            <label for="nome" class="font-semibold mb-2">Nome Completo</label>
            <input pInputText id="nome" type="text" [(ngModel)]="participanteModel.nomeCompleto" required [disabled]="isLoading" />
          </div>

          <div class="field flex flex-col mb-4">
            <label for="email" class="font-semibold mb-2">Email</label>
            <input pInputText id="email" type="email" [(ngModel)]="participanteModel.email" required [disabled]="isLoading" />
          </div>

          <div class="field flex flex-col mb-4">
            <label for="dataNascimento" class="font-semibold mb-2">Data de Nascimento</label>
            <p-calendar 
                [(ngModel)]="dataNascimento" 
                [showIcon]="true" 
                dateFormat="dd/mm/yy"
                [disabled]="isLoading">
            </p-calendar>
          </div>

        </div>
      </div>

      <div class="flex justify-content-end mt-4">
          <!-- Adicionamos [loading] para feedback visual -->
          <p-button 
            label="Cadastrar Participante" 
            icon="pi pi-plus" 
            [loading]="isLoading" 
            (click)="onSubmit()">
          </p-button>
      </div>
    </div>
  `,
  providers: [MessageService] // Garante uma instância do serviço de mensagens
})
export class CadastroParticipanteComponent {

  // Objeto para ligar aos campos do formulário
  participanteModel: ParticipanteRequest = {
    nomeCompleto: '',
    email: '',
    dataNascimento: ''
  };
  
  // Propriedade separada para o p-calendar
  dataNascimento: Date | null = null;
  
  // Estado de carregamento
  isLoading: boolean = false;

  constructor(
    private participanteService: ParticipanteService,
    private messageService: MessageService,
    private router: Router // Injeção do Router para redirecionar
  ) {}

  onSubmit(): void {
    // Validação básica
    if (!this.participanteModel.nomeCompleto || !this.participanteModel.email) {
        this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha nome e e-mail.' });
        return;
    }

    // Formata a data
    if (this.dataNascimento) {
      const tzoffset = (new Date()).getTimezoneOffset() * 60000;
      const localISOTime = (new Date(this.dataNascimento.getTime() - tzoffset)).toISOString().split('T')[0];
      this.participanteModel.dataNascimento = localISOTime;
    } else {
        this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Data de nascimento é obrigatória.' });
        return;
    }
    
    // Ativa o loading
    this.isLoading = true;

    this.participanteService.criarParticipante(this.participanteModel)
      .subscribe({
        next: (resposta) => {
          console.log('Participante criado com sucesso!', resposta);
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Participante cadastrado!' });
          
          // Aguarda 1 segundo para o usuário ler a mensagem e redireciona
          setTimeout(() => {
              this.isLoading = false;
              this.router.navigate(['/participantes']);
          }, 1000);
        },
        error: (erro) => {
          this.isLoading = false; // Para o loading em caso de erro
          console.error('Erro ao criar participante:', erro);
          const detalheErro = erro.error?.message || 'Verifique os dados e tente novamente.';
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: `Falha ao cadastrar: ${detalheErro}` });
        }
      });
  }
}