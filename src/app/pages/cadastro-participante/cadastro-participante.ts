// Importações essenciais do Angular e PrimeNG
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';

// Nossas importações personalizadas
import { ParticipanteService, ParticipanteRequest } from '../../layout/service/participante.service';  // Ajuste o caminho se necessário

@Component({
  selector: 'app-cadastro-participante',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputTextModule,
    CalendarModule // Módulo para o seletor de data
  ],
  template: `
    <div class="card">
      <h5>Cadastrar Novo Participante</h5>
      
      <div class="p-fluid grid mt-3">
        <div class="col-12">
          
          <div class="field flex flex-col mb-4">
            <label for="nome" class="font-semibold mb-2">Nome Completo</label>
            <input pInputText id="nome" type="text" [(ngModel)]="participanteModel.nomeCompleto" required />
          </div>

          <div class="field flex flex-col mb-4">
            <label for="email" class="font-semibold mb-2">Email</label>
            <input pInputText id="email" type="email" [(ngModel)]="participanteModel.email" required />
          </div>

          <div class="field flex flex-col mb-4">
            <label for="dataNascimento" class="font-semibold mb-2">Data de Nascimento</label>
            <p-calendar [(ngModel)]="dataNascimento" [showIcon]="true" dateFormat="dd/mm/yy"></p-calendar>
          </div>

        </div>
      </div>

      <div class="flex justify-content-end mt-4">
          <p-button label="Cadastrar Participante" icon="pi pi-plus" (click)="onSubmit()"></p-button>
      </div>
    </div>
  `
})
export class CadastroParticipanteComponent {

  // Objeto para ligar aos campos do formulário
  participanteModel: ParticipanteRequest = {
    nomeCompleto: '',
    email: '',
    dataNascimento: ''
  };
  
  // Propriedade separada para o p-calendar, que trabalha melhor com objetos Date
  dataNascimento: Date | null = null;

  constructor(
    private participanteService: ParticipanteService,
    private messageService: MessageService // Para exibir notificações
  ) {}

  onSubmit(): void {
    // Antes de enviar, formatamos a data para o formato que o backend espera (YYYY-MM-DD)
    if (this.dataNascimento) {
      // Ajuste para o fuso horário local para evitar problemas de um dia a menos
      const tzoffset = (new Date()).getTimezoneOffset() * 60000;
      const localISOTime = (new Date(this.dataNascimento.getTime() - tzoffset)).toISOString().split('T')[0];
      this.participanteModel.dataNascimento = localISOTime;
    } else {
        this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Data de nascimento é obrigatória.' });
        return;
    }
    
    console.log('Enviando participante para o backend:', this.participanteModel);

    this.participanteService.criarParticipante(this.participanteModel)
      .subscribe({
        next: (resposta) => {
          console.log('Participante criado com sucesso!', resposta);
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Participante cadastrado!' });
          // Opcional: Limpar o formulário aqui
        },
        error: (erro) => {
          console.error('Erro ao criar participante:', erro);
          const detalheErro = erro.error?.message || 'Verifique os dados e tente novamente.';
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: `Falha ao cadastrar: ${detalheErro}` });
        }
      });
  }
}