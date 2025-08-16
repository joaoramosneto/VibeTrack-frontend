import { Component, OnInit } from '@angular/core';
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
    <p-toast></p-toast> <div class="card">
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
      
      </div>

    <div class="col-12 md:col-6">
      </div>
  </div>

  <p-divider></p-divider>
  <div class="flex justify-content-end">
      <p-button label="Cadastrar" icon="pi pi-check" styleClass="w-auto" (click)="onSubmit()"></p-button>
  </div>
</div>
  `,
  providers: [MessageService]
})
export class CadastroExperimentoComponent implements OnInit {

  tiposDeEmocao: any[] = [];
  emocaoSelecionada: any;
  descricaoAmbiente: string = '';

    // 1. Crie o objeto-modelo para os dados do formulário
  experimentoModel: ExperimentoRequest = {
    nome: '', // Será preenchido pelo formulário
    descricao: '', // Será preenchido pelo formulário
    dataInicio: '', // Será preenchido pelo formulário
    dataFim: '', // Será preenchido pelo formulário
    pesquisadorId: 1 // Começamos com um ID fixo para teste
  };
  constructor(
    private experimentoService: ExperimentoService, 
    private messageService: MessageService // Você já tem
  ) {}

  ngOnInit() {
    this.tiposDeEmocao = [
        { nome: 'Alegria', styleClass: 'text-green-500' },
        { nome: 'Raiva', styleClass: 'text-red-500' },
        { nome: 'Tristeza', styleClass: 'text-blue-500' },
        { nome: 'Medo', styleClass: 'text-orange-500' }
    ];
  }
  // 3. Crie o método de envio do formulário
  onSubmit(): void {
    // Aqui você pode enriquecer o objeto-modelo com outros dados da tela
    this.experimentoModel.descricao = `Emoção selecionada: ${this.emocaoSelecionada?.nome}. Descrição do ambiente: ${this.descricaoAmbiente}`;

    console.log('Enviando para o backend:', this.experimentoModel);

    this.experimentoService.criarExperimento(this.experimentoModel)
      .subscribe({
        next: (resposta) => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Experimento cadastrado!' });
          console.log('Resposta do backend:', resposta);
          // Opcional: Limpar o formulário após o sucesso
        },
        error: (erro) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao cadastrar experimento.' });
          console.error(erro);
        }
      });
  }
}