import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ExperimentoService } from '../../layout/service/experimento.service';
import { ParticipanteService } from '../../layout/service/participante.service';

// Nossos serviços e interfaces


@Component({
  selector: 'app-experimento-detalhes',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,     // <-- Isto corrige o erro do <p-card>
    ButtonModule,   // <-- Isto corrige o erro do <p-button>
    TableModule     // <-- Isto corrige o erro do <p-table>
  ],
  templateUrl: './experimento-detalhes.component.html',
  // styleUrls: ['./experimento-detalhes.component.css'] // Removido para corrigir o erro de CSS
})
export class ExperimentoDetalhesComponent implements OnInit {

  // As propriedades que o HTML estava procurando
  experimento: any = null;
  todosParticipantes: any[] = [];
  experimentoId!: number;

  constructor(
    private route: ActivatedRoute,
    private experimentoService: ExperimentoService,
    private participanteService: ParticipanteService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.experimentoId = +idParam;
      this.carregarDadosDoExperimento();
      this.carregarTodosParticipantes();
    }
  }

  carregarDadosDoExperimento(): void {
    this.experimentoService.getExperimentoById(this.experimentoId).subscribe({
      next: (data) => { this.experimento = data; },
      error: (err) => { this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar experimento.' }); }
    });
  }

  carregarTodosParticipantes(): void {
    this.participanteService.getParticipantes().subscribe({
      next: (data) => { this.todosParticipantes = data; },
      error: (err) => { this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar participantes.' }); }
    });
  }

  // Os métodos que o HTML estava procurando
  adicionarParticipante(idParticipante: number): void {
    this.experimentoService.adicionarParticipante(this.experimentoId, idParticipante).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Participante adicionado!' });
        this.carregarDadosDoExperimento(); // Recarrega para atualizar a lista
      },
      error: (err) => { this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao adicionar participante.' }); }
    });
  }

  isParticipanteNoExperimento(idParticipante: number): boolean {
    if (!this.experimento?.participantes) {
      return false;
    }
    return this.experimento.participantes.some((p: any) => p.id === idParticipante);
  }
}