<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router'; // Importe o Router
=======
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router'; // <-- 1. IMPORT RouterLink
>>>>>>> Stashed changes
=======
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router'; // <-- 1. IMPORT RouterLink
>>>>>>> Stashed changes
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
<<<<<<< Updated upstream
<<<<<<< Updated upstream

export interface Experimento {
    id?: number;
    pesquisador?: string;
    participante?: string;
    tipo?: string;
    data?: string;
}

@Component({
    selector: 'app-experimentos',
    standalone: true,
    imports: [
        CommonModule, TableModule, FormsModule, ButtonModule, RippleModule,
        ToastModule, ToolbarModule, DialogModule, InputTextModule, ConfirmDialogModule
    ],
    templateUrl: './experimentos.component.html',
    providers: [MessageService, ConfirmationService]
})
export class ExperimentosComponent implements OnInit {
    experimentos = signal<Experimento[]>([]);
    experimento: Experimento = {};
    selectedExperimentos!: Experimento[] | null;
    experimentoDialog: boolean = false;

    @ViewChild('dt') dt!: Table;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router // Injete o Router
    ) {}

    ngOnInit() {
        this.experimentos.set([
            { id: 1, pesquisador: 'Dr. João', participante: 'Participante 1', tipo: 'Tipo A', data: '2024-07-25' },
            { id: 2, pesquisador: 'Dra. Maria', participante: 'Participante 2', tipo: 'Tipo B', data: '2024-07-26' },
            { id: 3, pesquisador: 'Dr. Carlos', participante: 'Participante 3', tipo: 'Tipo A', data: '2024-07-27' }
        ]);
    }

    // Função que leva para a página de cadastro
    novoExperimento() {
        this.router.navigate(['/cadastro-experimento']);
    }
    
    verResultado(experimento: Experimento) {
        this.router.navigate(['/experimentos', experimento.id]);
    }

    deleteExperimento(experimento: Experimento) {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir o experimento?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.experimentos.set(this.experimentos().filter((val) => val.id !== experimento.id));
                this.experimento = {};
                this.messageService.add({
                    severity: 'success', summary: 'Sucesso', detail: 'Experimento Deletado', life: 3000
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

    saveExperimento() {
        this.hideDialog();
    }
=======
=======
>>>>>>> Stashed changes
import { Experimento, ExperimentoService } from '../../layout/service/experimento.service';

@Component({
  selector: 'app-experimentos',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    ToastModule,
    ConfirmDialogModule,
    RouterLink // <-- 2. ADD IT TO THE IMPORTS ARRAY
  ],
  templateUrl: './experimentos.component.html',
  providers: [MessageService, ConfirmationService]
})
export class ExperimentosComponent implements OnInit {

  experimentos: Experimento[] = [];

  constructor(
    private experimentoService: ExperimentoService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.carregarExperimentos();
  }

  carregarExperimentos(): void {
    this.experimentoService.getExperimentos().subscribe({
      next: (data: Experimento[]) => this.experimentos = data,
      error: (err: any) => {
        console.error('Erro ao carregar experimentos', err);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os experimentos.' });
      }
    });
  }

  novoExperimento(): void {
    this.router.navigate(['/cadastro-experimento']);
  }

  editExperimento(experimento: Experimento): void {
    this.router.navigate(['/cadastro-experimento', experimento.id]);
  }

  deleteExperimento(experimento: Experimento): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja deletar o experimento "${experimento.nome}"?`,
      header: 'Confirmar exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.experimentoService.deleteExperimento(experimento.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Experimento deletado.' });
            this.carregarExperimentos();
          },
          error: (err: any) => {
            console.error('Erro ao deletar experimento', err);
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível deletar o experimento.' });
          }
        });
      }
    });
  }
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
}