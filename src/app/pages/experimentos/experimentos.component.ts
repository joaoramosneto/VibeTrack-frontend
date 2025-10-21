import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';

// 1. IMPORTAR O SERVICE E A INTERFACE CORRETA
import { Experimento, ExperimentoService } from '../../layout/service/experimento.service';

@Component({
  selector: 'app-experimentos',
  standalone: true,
  imports: [
    CommonModule, TableModule, FormsModule, ButtonModule, RippleModule,
    ToastModule, ToolbarModule, DialogModule, InputTextModule, ConfirmDialogModule,
    DropdownModule, TextareaModule, FileUploadModule
  ],
  templateUrl: './experimentos.component.html', // Assumindo que você tem um HTML separado
  providers: [MessageService, ConfirmationService]
})
export class ExperimentosComponent implements OnInit {

  // O signal agora é do tipo da interface que validamos
  experimentos = signal<Experimento[]>([]);

  // Objeto para edição no dialog
  experimento: Experimento = { id: 0, nome: '', descricao: '', dataInicio: '', dataFim: '', pesquisador: { id: 0, nome: '' }, statusExperimento: '',tipoEmocao:'', participantes:[] };

  selectedExperimentos!: Experimento[] | null;
  experimentoDialog: boolean = false;

  statusOptions: any[] = [];
  tiposDeEmocao: any[] = [];
  emocaoSelecionada: any;
  descricaoAmbiente: string = '';
  selectedFile: File | null = null;

  @ViewChild('dt') dt!: Table;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private experimentoService: ExperimentoService // 2. INJETAR O SERVICE
  ) {}

  ngOnInit() {
    // 3. CARREGAR OS DADOS REAIS AO INICIAR O COMPONENTE
    this.carregarExperimentos();

    this.tiposDeEmocao = [
        { nome: 'Alegria' },
        { nome: 'Raiva' },
        { nome: 'Tristeza' },
        { nome: 'Medo' }
    ];
    this.statusOptions = [
        { label: 'Planejado', value: 'PLANEJADO' },
        { label: 'Em Andamento', value: 'EM_ANDAMENTO' },
        { label: 'Concluído', value: 'CONCLUIDO' },
        { label: 'Cancelado', value: 'CANCELADO' },
        { label: 'Pausado', value: 'PAUSADO' }
    ];
  }

  carregarExperimentos() {
    this.experimentoService.getExperimentos().subscribe({
      next: (dados) => {
        this.experimentos.set(dados);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar a lista de experimentos.' });
        console.error(err);
      }
    });
  }

  novoExperimento() {
    // A rota deve ser a mesma do seu componente de cadastro
    this.router.navigate(['/cadastro-experimento']);
  }

  verResultado(experimento: Experimento) {
    // Esta rota pode ser para uma página de detalhes do experimento
    this.router.navigate(['/experimentos', experimento.id]);
  }

  deleteExperimento(experimento: Experimento) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o experimento "${experimento.nome}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // 4. CHAMAR O SERVICE PARA DELETAR
        this.experimentoService.deleteExperimento(experimento.id).subscribe({
          next: () => {
            // Se o backend confirmou, remove da lista local
            this.experimentos.update(lista => lista.filter((val) => val.id !== experimento.id));
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Experimento Deletado', life: 3000 });
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível deletar o experimento.' });
            console.error(err);
          }
        });
      }
    });
  }

  editExperimento(experimento: Experimento) {
    // Clona o objeto para o formulário de edição para não alterar a tabela diretamente
    this.experimento = { ...experimento };
    this.experimentoDialog = true;
  }

  hideDialog() {
    this.experimentoDialog = false;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  saveExperimento() {
    // 5. CHAMAR O SERVICE PARA ATUALIZAR
    // O backend espera um ExperimentoRequestDTO, então enviamos apenas os campos necessários
    const dadosParaAtualizar = {
        nome: this.experimento.nome,
        descricao: this.experimento.descricao,
        dataInicio: this.experimento.dataInicio,
        dataFim: this.experimento.dataFim,
        statusExperimento: this.experimento.statusExperimento,
        pesquisadorId: this.experimento.pesquisador.id,
        tipoEmocao: this.emocaoSelecionada ? this.emocaoSelecionada.nome : null
         // Certifique-se que esta linha existe
        // adicione outros campos do DTO de request se necessário
    };

    this.experimentoService.updateExperimento(this.experimento.id, dadosParaAtualizar).subscribe({
        next: (experimentoAtualizado) => {
            // Atualiza a lista local com os dados retornados pelo backend
            this.experimentos.update(lista => {
                const index = lista.findIndex(item => item.id === experimentoAtualizado.id);
                const novaLista = [...lista];
                if (index !== -1) {
                    novaLista[index] = experimentoAtualizado;
                }
                return novaLista;
            });
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Experimento Atualizado', life: 3000 });
            this.hideDialog(); // Fecha o dialog após o sucesso
        },
        error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível atualizar o experimento.' });
            console.error(err);
        }
    });
  }
}