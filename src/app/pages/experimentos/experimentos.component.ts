import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router'; // Importe o Router
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
}