import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { TextareaModule } from 'primeng/textarea';
import { DividerModule } from 'primeng/divider';
import { ExperimentoRequest, ExperimentoService } from '../../layout/service/experimento.service';
import { AuthService } from '../service/auth.service'; 
import { Participante, ParticipanteService } from '../../layout/service/participante.service'; // Importe o ParticipanteService

@Component({
  selector: 'app-cadastro-experimento',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    ToastModule,
    DropdownModule,
    TextareaModule,
    NgClass,
    DividerModule
  ],
  template: `
    <p-toast></p-toast>
    <div class="card">
      <h5>Cadastro de Experimento</h5>
      
      <div class="p-fluid grid mt-3">
        <div class="col-12 md:col-6">
          
          <div class="field flex flex-col mb-4">
            <label for="nome" class="font-semibold mb-2">Nome do Experimento:</label>
            <input pInputText id="nome" type="text" [(ngModel)]="experimentoModel.nome" required />
          </div>

          <!-- Campo de Participante -->
          <div class="field flex flex-col mb-4">
            <label for="participante" class="font-semibold mb-2">Participante Principal (*)</label>
            <p-dropdown id="participante" 
                        [options]="participantesDisponiveis" 
                        [(ngModel)]="participanteSelecionado" 
                        optionLabel="nomeCompleto" 
                        placeholder="Selecione o participante"
                        [filter]="true"
                        required>
            </p-dropdown>
          </div>

          <div class="field flex flex-col mb-4">
            <label for="dataInicio" class="font-semibold mb-2">Data de Início:</label>
            <input pInputText id="dataInicio" type="date" [(ngModel)]="experimentoModel.dataInicio" required />
          </div>

          <div class="field flex flex-col mb-4">
            <label for="dataFim" class="font-semibold mb-2">Data de Fim:</label>
            <input pInputText id="dataFim" type="date" [(ngModel)]="experimentoModel.dataFim" required />
          </div>

          <!-- Seção de Mídia -->
          <div class="field flex flex-col mb-4">
            <label for="arquivoMidia" class="font-semibold mb-2">Anexar Mídia (Opcional)</label>
            <input type="file" id="arquivoMidia" (change)="onFileSelected($event)" class="p-inputtext">
            <div *ngIf="selectedFile" class="mt-2">
              <span class="font-semibold">Arquivo selecionado:</span> {{ selectedFile.name }}
            </div>
          </div>
          
        </div>

        <div class="col-12 md:col-6">
          <div class="field flex flex-col mb-4">
              <label for="emocao" class="font-semibold mb-2">Tipo de Emoção a ser Induzida:</label>
              <p-dropdown id="emocao" 
                          [options]="tiposDeEmocao" 
                          [(ngModel)]="emocaoSelecionada" 
                          optionLabel="nome" 
                          placeholder="Selecione uma emoção">
              </p-dropdown>
          </div>

          <div class="field flex flex-col mb-4">
            <label for="status" class="font-semibold mb-2">Status do Experimento:</label>
            <p-dropdown id="status"
                        [options]="statusOptions"
                        [(ngModel)]="experimentoModel.statusExperimento" 
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Selecione um status">
            </p-dropdown>
          </div>

          <div class="field flex flex-col mb-4">
            <label for="descricao" class="font-semibold mb-2">Descrição do Ambiente:</label>
            <textarea pInputTextarea id="descricao" [(ngModel)]="descricaoAmbiente" rows="5"></textarea>
          </div>
        </div>
      </div>

      <p-divider></p-divider>
      <div class="flex justify-content-end">
          <p-button label="Cadastrar" icon="pi pi-check" styleClass="w-auto" (click)="onSubmit()" [disabled]="!isFormValid()"></p-button>
      </div>
    </div>
  `,
  providers: [MessageService]
})
export class CadastroExperimentoComponent implements OnInit {

  tiposDeEmocao: any[] = [];
  emocaoSelecionada: any;
  descricaoAmbiente: string = '';
  statusOptions: any[] = [];
  
  // Variáveis para participante
  participantesDisponiveis: Participante[] = [];
  participanteSelecionado: Participante | null = null;
  
  experimentoModel: ExperimentoRequest = {
    nome: '',
    descricao: '', 
    dataInicio: '',
    dataFim: '',
    pesquisadorId: 0, 
    tipoEmocao: '',
    statusExperimento: 'PLANEJADO'
  };

  selectedFile: File | null = null;
  isLoading: boolean = false; // Adicionado para controlar o estado de carregamento

  constructor(
    private experimentoService: ExperimentoService, 
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router,
    private participanteService: ParticipanteService // Injeta o serviço de participante
  ) {}

  ngOnInit() {
    this.carregarParticipantes(); // Carrega a lista ao iniciar
    
    this.tiposDeEmocao = [
        { nome: 'Alegria', styleClass: 'text-yellow-500' },
        { nome: 'Raiva', styleClass: 'text-red-500' },
        { nome: 'Tristeza', styleClass: 'text-blue-500' },
        { nome: 'Medo', styleClass: 'text-purple-500' }
    ];
    
    this.statusOptions = [
        { label: 'Planejado', value: 'PLANEJADO' },
        { label: 'Em Andamento', value: 'EM_ANDAMENTO' },
        { label: 'Concluído', value: 'CONCLUIDO' },
        { label: 'Cancelado', value: 'CANCELADO' },
        { label: 'Pausado', value: 'PAUSADO' }
    ];
  }
    
  // Método para buscar participantes do backend
  carregarParticipantes(): void {
    this.participanteService.getParticipantes().subscribe({
      next: (participantes) => {
        this.participantesDisponiveis = participantes;
        if (participantes.length === 0) {
            this.messageService.add({severity:'warn', summary:'Aviso', detail:'Nenhum participante cadastrado. Crie um antes de continuar.'});
        }
      },
      error: (err) => {
        this.messageService.add({severity:'error', summary:'Erro', detail:'Falha ao carregar participantes.'});
        console.error(err);
      }
    });
  }
    
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
  
  // Validação do formulário incluindo o participante
  isFormValid(): boolean {
    return !!this.experimentoModel.nome && 
           !!this.experimentoModel.dataInicio && 
           !!this.emocaoSelecionada && 
           !!this.participanteSelecionado;
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
        this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha todos os campos obrigatórios.' });
        return;
    }
    
    const pesquisadorId = this.authService.getPesquisadorId();
    if (!pesquisadorId) {
        this.messageService.add({ 
            severity: 'error', 
            summary: 'Erro de Autenticação', 
            detail: 'Não foi possível identificar o pesquisador.' 
        });
        return;
    }

    this.isLoading = true; // Inicia o loading

    const payload = {
        nome: this.experimentoModel.nome,
        dataInicio: this.experimentoModel.dataInicio,
        dataFim: this.experimentoModel.dataFim,
        statusExperimento: this.experimentoModel.statusExperimento,
        pesquisadorId: pesquisadorId,
        // Envia o ID do participante selecionado
        participanteId: this.participanteSelecionado?.id, 
        descricaoAmbiente: this.descricaoAmbiente, 
        tipoEmocao: this.emocaoSelecionada?.nome   
    };

    console.log('Dados CORRIGIDOS a serem enviados:', payload);
    
    const formData = new FormData();
    formData.append('experimento', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    
    if (this.selectedFile) {
      formData.append('midia', this.selectedFile, this.selectedFile.name);
    }

    this.experimentoService.criarExperimento(formData)
      .subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Experimento cadastrado!' });
          setTimeout(() => {
            this.isLoading = false;
            this.router.navigate(['/experimentos']);
          }, 1500);
        },
        error: (erro) => {
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao cadastrar experimento.' });
          console.error(erro);
        }
      });
  }
}