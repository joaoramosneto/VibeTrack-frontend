import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Imports Visuais do PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
// VVVV CORREÇÃO: Adicionar o módulo visual ConfirmDialogModule VVVV
import { ConfirmDialogModule } from 'primeng/confirmdialog'; 

// Serviços e Interfaces
// CORREÇÃO: Importar ConfirmationService
import { MessageService, ConfirmationService } from 'primeng/api'; 
import { ParticipanteService, Participante } from '../../layout/service/participante.service'; 

@Component({
  selector: 'app-participantes',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    // VVVV INCLUÍDO NO ARRAY DE IMPORTS VVVV
    ConfirmDialogModule 
  ],
  templateUrl: './participantes.component.html',
  // Provedores necessários para a exclusão
  providers: [MessageService, ConfirmationService] 
})
export class ParticipanteComponent implements OnInit {

  participantes: Participante[] = [];
  isLoading: boolean = true;

  constructor(
    private participanteService: ParticipanteService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService // Injetado
  ) {}

  ngOnInit(): void {
    this.carregarParticipantes();
  }

  carregarParticipantes(): void {
    this.isLoading = true;

    this.participanteService.getParticipantes().subscribe({
      next: (data) => {
        this.participantes = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar participantes:', err);
        this.messageService.add({ 
            severity: 'error', 
            summary: 'Erro', 
            detail: 'Não foi possível carregar a lista de participantes.' 
        });
        this.isLoading = false;
      }
    });
  }
  
  refresh() {
    this.carregarParticipantes();
  }

  deletarParticipante(participante: Participante) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o participante ${participante.nomeCompleto}?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.participanteService.deletarParticipante(participante.id).subscribe({
          next: () => {
            this.participantes = this.participantes.filter(p => p.id !== participante.id);
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Sucesso', 
              detail: `Participante ${participante.nomeCompleto} excluído.` 
            });
          },
          error: (error) => {
            console.error(error);
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Erro', 
              detail: 'Falha ao excluir. Verifique se o participante não está associado a experimentos.' 
            });
          }
        });
      }
    });
  }
}