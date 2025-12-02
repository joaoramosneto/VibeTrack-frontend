// Imports que você já tinha
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

// Nossas importações personalizadas
import { RouterModule } from '@angular/router'; // Para usar o routerLink
import { ExperimentoService } from '../../../layout/service/experimento.service';


@Component({
  selector: 'app-experimentos-recentes-widget',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, RouterModule],
  // vvvv ESTILO CSS ADICIONADO AQUI vvvv
  styles: [`
    .thumbnail {
      width: 60px;
      height: 45px;
      object-fit: cover; /* Garante que a imagem não fique distorcida */
      border-radius: 4px;
      vertical-align: middle; /* Alinha a imagem verticalmente com o texto */
    }

    .thumbnail-placeholder {
      width: 60px;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f8f9fa; /* Cor de fundo do placeholder */
      border-radius: 4px;
      color: #6c757d; /* Cor do ícone */
      border: 1px solid #dee2e6;
    }
  `],
  // vvvv TEMPLATE MODIFICADO AQUI vvvv
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
                    <th>Mídia</th> <th style="width: 45%">Nome do Experimento</th>
                    <th>Nº de Participantes</th>
                    <th>Status</th>
                    <th>Pesquisador</th>
                    <th>Ações</th>
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-experimento>
                <tr>
                    <td>
                        <img *ngIf="experimento.urlMidia" [src]="experimento.urlMidia" [alt]="experimento.nome" class="thumbnail">

                        <div *ngIf="!experimento.urlMidia" class="thumbnail-placeholder">
                            <i class="pi pi-image" style="font-size: 1.5rem"></i>
                        </div>
                    </td>
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
                    <td colspan="6">Nenhum experimento encontrado.</td> </tr>
            </ng-template>
        </p-table>
    </div>
  `
})
export class ExperimentosRecentesWidget implements OnInit {
    experimentos: any[] = [];

    constructor(private experimentoService: ExperimentoService) {}

    ngOnInit() {
        // Este serviço agora precisa retornar os experimentos com o novo campo 'urlMidia'
        this.experimentoService.getExperimentos().subscribe(data => {
            this.experimentos = data;
        });
    }

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