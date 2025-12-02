
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Imports Visuais do PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

// Serviços e Interfaces
import { MessageService } from 'primeng/api';
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
    ToolbarModule
  ],
  templateUrl: './participantes.component.html',
  providers: [MessageService]
  // REMOVI A LINHA 'styleUrls' DAQUI
})
export class ParticipanteComponent implements OnInit {

  participantes: Participante[] = [];
  isLoading: boolean = true;

  constructor(
    private participanteService: ParticipanteService,
    private messageService: MessageService
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
        console.log("Participantes carregados:", data);
      },
      error: (err) => {
        console.error('Erro ao buscar participantes:', err);
        // Exibe o erro visualmente usando o Toast do PrimeNG
        this.messageService.add({ 
            severity: 'error', 
            summary: 'Erro', 
            detail: 'Não foi possível carregar a lista de participantes.' 
        });
        this.isLoading = false;
      }
    });
  }
  
  // Atalho para o botão de refresh
  refresh() {
    this.carregarParticipantes();
  }
}