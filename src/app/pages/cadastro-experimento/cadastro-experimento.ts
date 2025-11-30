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
import { Participante, ParticipanteService } from '../../layout/service/participante.service';

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
  providers: [MessageService],
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

          <div class="field flex flex-col mb-4">
            <label for="arquivoMidia" class="font-semibold mb-2">Anexar Mídias (Fotos/Vídeos)</label>
            
            <input type="file" id="arquivoMidia" multiple (change)="onFileSelected($event)" class="p-inputtext w-full">
            
            <div *ngIf="selectedFiles.length > 0" class="mt-3 surface-100 p-3 border-round">
                <h6 class="m-0 mb-2 text-700">Arquivos Selecionados ({{selectedFiles.length}}):</h6>
                <ul class="list-none p-0 m-0">
                    <li *ngFor="let file of selectedFiles; let i = index" class="flex align-items-center justify-content-between p-2 bg-white border-round mb-2 shadow-1">
                        <div class="flex align-items-center overflow-hidden">
                            <i class="pi pi-file mr-2 text-primary"></i>
                            <span class="white-space-nowrap overflow-hidden text-overflow-ellipsis text-sm">{{ file.name }}</span>
                        </div>
                        <button pButton icon="pi pi-times" class="p-button-rounded p-button-danger p-button-text p-button-sm flex-shrink-0" (click)="removeFile(i)"></button>
                    </li>
                </ul>
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
          <p-button label="Cadastrar" icon="pi pi-check" styleClass="w-auto" [loading]="isLoading" (click)="onSubmit()"></p-button>
      </div>
    </div>
  `
})
export class CadastroExperimentoComponent implements OnInit {

  tiposDeEmocao: any[] = [];
  emocaoSelecionada: any;
  descricaoAmbiente: string = '';
  statusOptions: any[] = [];
  
  participantesDisponiveis: Participante[] = [];
  participanteSelecionado: Participante | null = null;
  isLoading: boolean = false;

  experimentoModel: ExperimentoRequest = {
    nome: '',
    descricao: '', 
    dataInicio: '',
    dataFim: '',
    pesquisadorId: 0, 
    tipoEmocao: '',
    statusExperimento: 'PLANEJADO'
  };

  // LISTA DE ARQUIVOS
  selectedFiles: File[] = []; 

  constructor(
    private experimentoService: ExperimentoService, 
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router,
    private participanteService: ParticipanteService
  ) {}

  ngOnInit() {
    this.carregarParticipantes();
    
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
    
  carregarParticipantes(): void {
    this.participanteService.getParticipantes().subscribe({
      next: (participantes) => {
        this.participantesDisponiveis = participantes;
      },
      error: (err) => {
        this.messageService.add({severity:'error', summary:'Erro', detail:'Falha ao carregar participantes.'});
      }
    });
  }
    
  // Lógica para múltiplos arquivos
  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      // Adiciona os novos arquivos à lista (mantendo os anteriores se quiser)
      // Aqui estamos convertendo o FileList para Array e concatenando
      this.selectedFiles = [...this.selectedFiles, ...Array.from(event.target.files as FileList)];
    }
  }
  
  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }
  
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
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Usuário não autenticado.' });
        return;
    }

    this.isLoading = true;

    const payload = {
        nome: this.experimentoModel.nome,
        dataInicio: this.experimentoModel.dataInicio,
        dataFim: this.experimentoModel.dataFim,
        statusExperimento: this.experimentoModel.statusExperimento,
        pesquisadorId: pesquisadorId,
        participanteId: this.participanteSelecionado?.id,
        descricaoAmbiente: this.descricaoAmbiente, 
        tipoEmocao: this.emocaoSelecionada?.nome   
    };

    const formData = new FormData();
    formData.append('experimento', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    
    // Loop para adicionar múltiplos arquivos com a mesma chave 'midia'
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      for (const file of this.selectedFiles) {
        formData.append('midia', file, file.name);
      }
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