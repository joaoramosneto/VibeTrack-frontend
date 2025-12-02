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
import { TooltipModule } from 'primeng/tooltip';

import { Experimento, ExperimentoService } from '../../layout/service/experimento.service';

@Component({
  selector: 'app-experimentos',
  standalone: true,
  imports: [
    CommonModule, TableModule, FormsModule, ButtonModule, RippleModule,
    ToastModule, ToolbarModule, DialogModule, InputTextModule, ConfirmDialogModule,
    DropdownModule, TextareaModule, FileUploadModule, TooltipModule
  ],
  templateUrl: './experimentos.component.html',
  providers: [MessageService, ConfirmationService]
})
export class ExperimentosComponent implements OnInit {

  experimentos = signal<Experimento[]>([]);

  // VVVV CORREÇÃO FINAL: USAR 'midias: []' (LISTA DE OBJETOS) VVVV
  experimento: Experimento = { 
      id: 0, 
      nome: '', 
      descricaoGeral: '',      
      resultadoEmocional: '',  
      midias: [],              // CORRIGIDO: Era 'urlsMidia', agora é 'midias'
      dataInicio: '', 
      dataFim: '', 
      pesquisador: { id: 0, nome: '' }, 
      statusExperimento: '', 
      participantes: [] 
  };
  // ^^^^ FIM CORREÇÃO ^^^^

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
    private experimentoService: ExperimentoService 
  ) {}

  ngOnInit() {
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
    this.router.navigate(['/cadastro-experimento']);
  }

  verResultado(experimento: Experimento) {
    this.router.navigate(['/experimentos', experimento.id]);
  }

  deleteExperimento(experimento: Experimento) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o experimento "${experimento.nome}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.experimentoService.deleteExperimento(experimento.id).subscribe({
          next: () => {
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
    const dadosParaAtualizar = {
        nome: this.experimento.nome,
        descricaoAmbiente: this.experimento.descricaoGeral, 
        dataInicio: this.experimento.dataInicio,
        dataFim: this.experimento.dataFim,
        statusExperimento: this.experimento.statusExperimento,
        pesquisadorId: this.experimento.pesquisador.id,
        tipoEmocao: this.experimento.resultadoEmocional
        // Nota: Não enviamos 'midias' aqui
    };

    this.experimentoService.updateExperimento(this.experimento.id, dadosParaAtualizar as any).subscribe({
      next: (experimentoAtualizado) => {
        this.experimentos.update(lista => {
          const index = lista.findIndex(item => item.id === experimentoAtualizado.id);
          const novaLista = [...lista];
          if (index !== -1) {
            novaLista[index] = experimentoAtualizado;
          }
          return novaLista;
        });
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Experimento Atualizado', life: 3000 });
        this.hideDialog();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível atualizar o experimento.' });
        console.error(err);
      }
    });
  }
}