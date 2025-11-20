import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { ActivatedRoute } from '@angular/router'; // Importado para obter o ID da URL
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

  // --- Gráfico de Linha (Frequência Cardíaca) ---
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
      }
    }
  };
  public lineChartType: ChartType = 'line';

  // As propriedades do gráfico de pizza foram removidas.

  constructor(
    private experimentoService: ExperimentoService, 
    private route: ActivatedRoute // Injeção de dependência para a rota
  ) {
      Chart.register(...registerables);
    }
  
  ngOnInit(): void {
    // 1. OBTÉM O ID DA ROTA DINAMICAMENTE
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const experimentoId = +id; // Converte para número
        this.carregarDadosDashboard(experimentoId);
      } else {
        console.error("ID do experimento não encontrado na rota. Verifique a navegação.");
      }
    });
  }

  // MÉTODO PARA CARREGAR OS DADOS REAIS
  carregarDadosDashboard(experimentoId: number): void {
    // A tipagem da resposta agora ignora os dados do gráfico de pizza, 
    // mas o backend continua enviando o objeto completo (DashboardDTO).
    this.experimentoService.getDashboardData(experimentoId).subscribe(
      (data: { frequenciaCardiaca: { labels: any; datasets: any; }; distribuicaoEmocoes: any; }) => {
        
        // Preenche os dados do gráfico de linha (Frequência Cardíaca)
        this.lineChartData = {
          labels: data.frequenciaCardiaca.labels,
          datasets: data.frequenciaCardiaca.datasets
        };

        // NOTA: Os dados 'data.distribuicaoEmocoes' são recebidos do backend,
        // mas são ignorados e não atribuídos a nenhuma propriedade, conforme solicitado.
      },
      error => {
          console.error('Erro ao carregar o dashboard:', error);
      }
    );
  }
}