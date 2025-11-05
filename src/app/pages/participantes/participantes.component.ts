import { Component, OnInit } from '@angular/core';
// 1. Importar o Serviço e a Interface do mesmo arquivo
import { ParticipanteService, Participante } from '../../layout/service/participante.service'; 
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
// (Ajuste o caminho '.._service/participante.service' conforme necessário)

@Component({
  selector: 'app-participante', // Você usará <app-participante> no HTML para chamar este componente
  templateUrl: './participantes.component.html',
  
  imports:[
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
  styleUrls: ['./participantes.components.css']
  
})
export class ParticipanteComponent implements OnInit {

  // 2. Propriedades para armazenar os dados, estado de loading e erros
  participantes: Participante[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  // 3. Injetar o serviço no construtor
  constructor(private participanteService: ParticipanteService) { }

  // 4. ngOnInit é chamado automaticamente quando o componente é carregado
  ngOnInit(): void {
    this.carregarParticipantes();
  }

  // 5. Método que chama o serviço
  carregarParticipantes(): void {
    this.isLoading = true; // Inicia o loading
    this.error = null; // Limpa erros anteriores

    this.participanteService.getParticipantes().subscribe({
      // 6. Callback de Sucesso
      next: (data: Participante[]) => {
        this.participantes = data; // Armazena os dados recebidos
        this.isLoading = false; // Para o loading
      },
      // 7. Callback de Erro
      error: (err: any) => {
        console.error('Erro ao buscar participantes:', err);
        this.error = 'Não foi possível carregar a lista de participantes. Tente novamente mais tarde.';
        this.isLoading = false; // Para o loading
      }
    });
  }
}