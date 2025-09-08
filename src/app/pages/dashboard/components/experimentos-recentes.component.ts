// Imports que você já tinha
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

// 1. Nossas importações personalizadas
import { RouterModule } from '@angular/router'; // Para usar o routerLink
import { ExperimentoService } from '../../../layout/service/experimento.service';


@Component({
  selector: 'app-experimentos-recentes-widget', // Nome do seletor atualizado
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, RouterModule],
  template: `
    <div class="card">
        <div class="flex justify-content-between align-items-center mb-5">
            <h5>Experimentos Recentes</h5>
            <div>
                <button pButton label="Ver Todos" icon="pi pi-arrow-right" class="p-button-text"></button>
            </div>
        </div>
        <p-table [value]="experimentos" [rows]="5" [paginator]="true" responsiveLayout="scroll">
            <ng-template pTemplate="header">
                <tr>
                    <th style="width: 45%">Nome do Experimento</th>
                    <th>Nº de Participantes</th>
                    <th>Status</th>
                    <th>Pesquisador</th>
                    <th>Ações</th>
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-experimento>
                <tr>
                    <td>{{ experimento.nome }}</td>
                    <td>{{ experimento.participantes?.length || 0 }}</td>
                    <td>
                        <p-tag [value]="experimento.statusExperimento" [severity]="getSeverity(experimento.statusExperimento)"></p-tag>
                    </td>
                    <td>{{ experimento.pesquisador?.nome }}</td>
                    <td style="width: 15%">
                        <button pButton pRipple icon="pi pi-search" class="p-button-rounded p-button-text" [routerLink]="['/experimentos', experimento.id]"></button>
                    </td>
                </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
                 <tr>
                    <td colspan="5">Nenhum experimento encontrado.</td>
                 </tr>
            </ng-template>
        </p-table>
    </div>
  `
})
export class ExperimentosRecentesWidget implements OnInit {
    // 2. A variável agora se chama 'experimentos' e é do tipo 'any[]'
    experimentos: any[] = [];

    // Injetamos nosso ExperimentoService
    constructor(private experimentoService: ExperimentoService) {}

    ngOnInit() {
        // Buscamos os experimentos do nosso backend via API
        this.experimentoService.getExperimentos().subscribe(data => {
            this.experimentos = data;
        });
    }

    // 4. A lógica do 'getSeverity' foi ajustada para os status do nosso backend
    getSeverity(status: string) {
        switch (status) {
            case 'CONCLUIDO': return 'success';
            case 'EM_ANDAMENTO': return 'warning';
            case 'PLANEJADO': return 'info';
            case 'CANCELADO': return 'danger';
            default: return 'secondary';
        }
    }
}