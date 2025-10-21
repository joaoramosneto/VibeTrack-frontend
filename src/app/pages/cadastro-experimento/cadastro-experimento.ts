import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importação do Router
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
import { AuthService } from '../service/auth.service'; // Importação do AuthService

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

          <div class="field flex flex-col mb-4">
            <label for="dataInicio" class="font-semibold mb-2">Data de Início:</label>
            <input pInputText id="dataInicio" type="date" [(ngModel)]="experimentoModel.dataInicio" required />
          </div>

          <div class="field flex flex-col mb-4">
            <label for="dataFim" class="font-semibold mb-2">Data de Fim:</label>
            <input pInputText id="dataFim" type="date" [(ngModel)]="experimentoModel.dataFim" required />
          </div>

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

  constructor(
    private experimentoService: ExperimentoService, 
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router 
  ) {}

  ngOnInit() {
    this.tiposDeEmocao = [
        { nome: 'Alegria', styleClass: 'text-green-500' },
        { nome: 'Raiva', styleClass: 'text-red-500' },
        { nome: 'Tristeza', styleClass: 'text-blue-500' },
        { nome: 'Medo', styleClass: 'text-orange-500' }
    ];
    this.statusOptions = [
        { label: 'Planejado', value: 'PLANEJADO' },
        { label: 'Em Andamento', value: 'EM_ANDAMENTO' },
        { label: 'Concluído', value: 'CONCLUIDO' },
        { label: 'Cancelado', value: 'CANCELADO' },
        { label: 'Pausado', value: 'PAUSADO' }
    ];
  }
    
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
  
  isFormValid(): boolean {
    return !!this.experimentoModel.nome && !!this.experimentoModel.dataInicio && !!this.emocaoSelecionada;
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

    this.experimentoModel.pesquisadorId = pesquisadorId;
    this.experimentoModel.tipoEmocao = this.emocaoSelecionada?.nome;
    this.experimentoModel.descricao = `Emoção selecionada: ${this.emocaoSelecionada?.nome}. Descrição do ambiente: ${this.descricaoAmbiente}`;

    console.log('Dados do experimento a serem enviados:', this.experimentoModel);
    
    const formData = new FormData();
    formData.append('experimento', new Blob([JSON.stringify(this.experimentoModel)], { type: 'application/json' }));
    
    if (this.selectedFile) {
      formData.append('midia', this.selectedFile, this.selectedFile.name);
    }

    this.experimentoService.criarExperimento(formData)
      .subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Experimento cadastrado!' });
          setTimeout(() => {
            this.router.navigate(['/experimentos']);
          }, 1500);
        },
        error: (erro) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao cadastrar experimento.' });
          console.error(erro);
        }
      });
  }
}