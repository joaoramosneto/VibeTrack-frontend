import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common'; 

import { ExperimentoService } from '../../layout/service/experimento.service';

// 1. INTERFACE SIMPLIFICADA PARA A TABELA (SÓ DADOS)
interface TableDataRow {
  valor: number;
  tipoDado: string; // Este campo agora conterá a string completa: "frequencia minima"
}

@Component({
  selector: 'app-experimento-dashboard',
  standalone: true,
  imports: [
    BaseChartDirective,
    CommonModule
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
    plugins: {
        legend: {
            display: false // Legenda removida
        }
    },
    scales: {
      y: {
        beginAtZero: true
      },
      x: { 
        title: {
          display: true,
          text: 'Tipo de Frequência Cardíaca'
        }
      }
    }
  };
  public lineChartType: ChartType = 'line'; 

  // 2. PROPRIEDADES DA TABELA SIMPLIFICADAS
  public tableData: TableDataRow[] = [];

  constructor(
    private experimentoService: ExperimentoService, 
    private route: ActivatedRoute 
  ) {
      Chart.register(...registerables);
    }
  
  ngOnInit(): void {
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
      (data: { frequenciaCardiaca: { labels: string[]; datasets: { label: string, data: number[] }[]; }; distribuicaoEmocoes: any; }) => {
        
        // Preenche os dados do gráfico
        this.lineChartData = {
          labels: data.frequenciaCardiaca.labels,
          datasets: data.frequenciaCardiaca.datasets
        };

        // TRANSFORMA DADOS DO GRÁFICO EM DADOS DE TABELA
        this.tableData = this.transformarDadosParaTabela(data.frequenciaCardiaca);
      },
      error => {
          console.error('Erro ao carregar o dashboard:', error);
          this.tableData = [];
      }
    );
  }

  // MÉTODO: TRANSFORMA DADOS AGREGADOS DO GRÁFICO EM LINHAS DE TABELA
  transformarDadosParaTabela(chartData: { labels: string[]; datasets: { label: string, data: number[] }[]; }): TableDataRow[] {
      const table: TableDataRow[] = [];
      const dataset = chartData.datasets[0]; 

      chartData.labels.forEach((label, index) => {
          let displayTipo = '';
          
          // LÓGICA DE CONVERSÃO DE STRING:
          switch (label) {
              case 'FC Mínima':
                  displayTipo = 'frequencia minima';
                  break;
              case 'FC Média':
                  displayTipo = 'frequencia media';
                  break;
              case 'FC Máxima':
                  displayTipo = 'frequencia maxima';
                  break;
              default:
                  displayTipo = label;
          }

          table.push({
              valor: dataset.data[index],
              tipoDado: displayTipo, // <-- Usa o valor escrito por extenso
          });
      });

      return table;
  }
}