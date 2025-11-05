import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Experimento, ExperimentoService } from '../../layout/service/experimento.service';
import { Participante, ParticipanteService } from '../../layout/service/participante.service';

// IMPORTS NECESSÁRIOS
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';


@Component({
  selector: 'app-experimento-detalhes',
  standalone: true,
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    CardModule,
    TableModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    TooltipModule,
    RouterLink
  ],
  templateUrl: './experimento-detalhes.component.html',
  providers: [MessageService]
})
export class ExperimentoDetalhesComponent implements OnInit {

  experimento: Experimento | null = null;
  todosParticipantes: Participante[] = [];

  exibirDialogCodigo = false;
  codigoSessao = '';

  constructor(
    private route: ActivatedRoute,
    private experimentoService: ExperimentoService,
    private participanteService: ParticipanteService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      // Apenas a primeira chamada é feita aqui
      this.carregarDetalhesExperimento(id);
      
    }
  }

  carregarDetalhesExperimento(id: number): void {
    this.experimentoService.getExperimentoById(id).subscribe(dados => {
      this.experimento = dados;
      // =================================================================
      // ====> CORREÇÃO: A segunda chamada agora acontece AQUI <====
      // =================================================================
      // Só depois que 'this.experimento' tem um valor,
      // nós buscamos a lista de todos os participantes para filtrar.
      this.carregarTodosParticipantes();
    });
  }

  carregarTodosParticipantes(): void {
    this.participanteService.getParticipantes().subscribe(dados => {
        if (this.experimento) {
            // Agora este filtro funcionará, pois 'this.experimento' já existe
            const idsParticipantesNoExperimento = new Set(this.experimento.participantes.map(p => p.id));
            this.todosParticipantes = dados.filter(p => !idsParticipantesNoExperimento.has(p.id));
        } else {
            this.todosParticipantes = dados;
        }
    });
  }

  iniciarColeta(participanteId: number): void {
    if (!this.experimento) return;

    const request = {
      experimentoId: this.experimento.id,
      participanteId: participanteId
    };

    this.experimentoService.iniciarSessaoColeta(request).subscribe({
      next: (response) => {
        this.codigoSessao = response.codigo;
        this.exibirDialogCodigo = true;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível iniciar a sessão de coleta.' });
      }
    });
  }

  adicionarParticipante(participanteId: number): void {
    if (!this.experimento) return;
    this.experimentoService.adicionarParticipante(this.experimento.id, participanteId).subscribe({
        next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Participante adicionado!' });
            // Recarrega os detalhes do experimento, o que vai automaticamente
            // chamar 'carregarTodosParticipantes' de novo na ordem certa.
            this.carregarDetalhesExperimento(this.experimento!.id);
        },
        error: () => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível adicionar o participante.' });
        }
    });
  }

  isParticipanteNoExperimento(participanteId: number): boolean {
    return this.experimento?.participantes.some(p => p.id === participanteId) ?? false;
  }
}