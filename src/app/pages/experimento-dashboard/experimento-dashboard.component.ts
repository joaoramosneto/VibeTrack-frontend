import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';

import { ExperimentoService } from '../../layout/service/experimento.service';

@Component({
  selector: 'app-experimento-dashboard',
  standalone: true,
  imports: [
    BaseChartDirective
  ],
  templateUrl: './experimento-dashboard.component.html',
  styleUrls: ['./experimento-dashboard.component.css']
})
export class ExperimentoDashboardComponent implements OnInit {

  // --- Gráfico de Linha/Barra (Frequência Cardíaca) ---
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: []
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      },
      // Adicionando um título para o eixo X para clareza
      x: { 
        title: {
          display: true,
          text: 'Tipo de Frequência Cardíaca'
        }
      }
    }
  };
  // CORREÇÃO: Usando 'bar' para melhor representação visual de categorias.
  public lineChartType: ChartType = 'bar'; 

  // As propriedades do gráfico de pizza foram removidas.

  constructor(
    private experimentoService: ExperimentoService, 
    private route: ActivatedRoute 
  ) {
      Chart.register(...registerables);
    }
  
  ngOnInit(): void {
    // 1. OBTÉM O ID DA ROTA DINAMICAMENTE
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const experimentoId = +id;
        this.carregarDadosDashboard(experimentoId);
      } else {
        console.error("ID do experimento não encontrado na rota.");
      }
    });
  }

  // MÉTODO PARA CARREGAR OS DADOS REAIS
  carregarDadosDashboard(experimentoId: number): void {
    this.experimentoService.getDashboardData(experimentoId).subscribe(
      (data: { frequenciaCardiaca: { labels: any; datasets: any; }; distribuicaoEmocoes: any; }) => {
        
        // Preenche os dados do gráfico de linha (agora gráfico de barra)
        // Os labels virão do backend: ["FC Mínima", "FC Média", "FC Máxima"]
        this.lineChartData = {
          labels: data.frequenciaCardiaca.labels,
          datasets: data.frequenciaCardiaca.datasets
        };

        // Os dados 'data.distribuicaoEmocoes' são recebidos e ignorados.
      },
      error => {
          console.error('Erro ao carregar o dashboard:', error);
      }
    );
  }
}