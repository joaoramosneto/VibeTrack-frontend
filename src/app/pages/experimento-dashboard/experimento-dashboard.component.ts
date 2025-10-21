import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';

// Importe a diretiva diretamente
import { BaseChartDirective } from 'ng2-charts';

// Importe o seu serviço que faz chamadas para a API
// O caminho pode variar dependendo da estrutura do seu projeto
import { ExperimentoService } from '../../layout/service/experimento.service';

@Component({
  selector: 'app-experimento-dashboard',
  standalone: true,
  imports: [
    BaseChartDirective // Apenas a diretiva é necessária aqui
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
    maintainAspectRatio: false, // Importante para o CSS controlar a altura
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  public lineChartType: ChartType = 'line';

  // --- Gráfico de Pizza (Emoções) ---
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{
      data: []
    }]
  };
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false, // Importante para o CSS controlar a altura
  };
  public pieChartType: ChartType = 'pie'; // Pode ser 'pie' ou 'doughnut'

  constructor(private experimentoService: ExperimentoService) {
     Chart.register(...registerables);
   }
  
  ngOnInit(): void {
    // Busca os dados mockados da API. Usamos um ID qualquer (ex: 1).
    const experimentoId = 1;
    this.experimentoService.getDashboardData(experimentoId).subscribe((data: { frequenciaCardiaca: { labels: any; datasets: any; }; distribuicaoEmocoes: { labels: (string | string[])[] | undefined; data: number[]; }; }) => {
      // Preenche os dados do gráfico de linha
      this.lineChartData = {
        labels: data.frequenciaCardiaca.labels,
        datasets: data.frequenciaCardiaca.datasets
      };

      // Preenche os dados do gráfico de pizza
      this.pieChartData.labels = data.distribuicaoEmocoes.labels;
      this.pieChartData.datasets[0].data = data.distribuicaoEmocoes.data;
    });
  }
}