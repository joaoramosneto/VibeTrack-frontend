import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { TextareaModule } from 'primeng/textarea';
import { DividerModule } from 'primeng/divider';
import { ExperimentoRequest, ExperimentoService } from '../../layout/service/experimento.service';
// Ajustei o caminho do serviço para um mais provável. Verifique se está correto.


@Component({
  selector: 'app-cadastro-experimento',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
            </div>

            <div class="col-12 md:col-6">
                <div class="field mb-4">
                    <label for="tipo-emocao" class="font-semibold mb-2">Emoção:</label>
                    <p-dropdown 
                        [options]="tiposDeEmocao" 
                        [(ngModel)]="emocaoSelecionada" 
                        placeholder="Selecione um tipo"
                        optionLabel="nome">
                    </p-dropdown>
                </div>
             <div class="field mb-4">
               <label for="status" class="font-semibold mb-2">Status do Experimento:</label>
               <p-dropdown 
                   [options]="tiposDeStatus" 
                   [(ngModel)]="statusSelecionado" 
                   optionLabel="nome"
                   [disabled]="true"> </p-dropdown>
             </div>
                <div class="field flex flex-col">
                    <label for="descricao" class="font-semibold mb-2">Descrição de Ambiente</label>
                    <textarea id="descricao" pTextarea [(ngModel)]="descricaoAmbiente" rows="5"></textarea>
                </div>
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

  // NOVAS PROPRIEDADES PARA O STATUS
  tiposDeStatus: any[] = [];
  statusSelecionado: any;


  // Modelo de dados que será enviado para o backend
  experimentoModel: ExperimentoRequest = {
    nome: '',
    descricao: '',
    dataInicio: '',
    dataFim: '',
    pesquisadorId: 1, // CORRIGIDO: Adicionado um valor padrão (1) para o ID do pesquisador
    tipoEmocao: '' 
  };
  
  constructor(
    private experimentoService: ExperimentoService, 
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.tiposDeEmocao = [
        { nome: 'ALEGRIA', styleClass: 'text-green-500' },
        { nome: 'RAIVA', styleClass: 'text-red-500' },
        { nome: 'TRISTEZA', styleClass: 'text-blue-500' },
        { nome: 'MEDO', styleClass: 'text-orange-500' }
    ];
     // Define as opções de status para o dropdown
    this.tiposDeStatus = [
        { nome: 'PLANEJADO' },
        { nome: 'EM_ANDAMENTO' },
        { nome: 'CONCLUIDO' },
        { nome: 'CANCELADO' }
    ];

    // Define o status inicial padrão, que será exibido no formulário
    this.statusSelecionado = this.tiposDeStatus[0]; 
  }
    

  onSubmit(): void {
    // 1. Preenche os campos do modelo com os dados do formulário
    this.experimentoModel.tipoEmocao = this.emocaoSelecionada?.nome; // Pega o nome da emoção selecionada
    this.experimentoModel.descricao = `Emoção: ${this.emocaoSelecionada?.nome}. Ambiente: ${this.descricaoAmbiente}`;

    console.log('Enviando para o backend:', this.experimentoModel);

    // 2. Chama o serviço para enviar os dados
    this.experimentoService.criarExperimento(this.experimentoModel)
      .subscribe({
        next: (resposta) => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Experimento cadastrado!' });
          console.log('Resposta do backend:', resposta);
        },
        error: (erro) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao cadastrar experimento.' });
          console.error(erro);
        }
      });
  }
}