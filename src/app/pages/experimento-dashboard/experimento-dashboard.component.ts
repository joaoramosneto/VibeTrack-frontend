import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common'; // NECESSÁRIO para usar *ngFor na tabela

import { ExperimentoService } from '../../layout/service/experimento.service';

// 1. NOVA INTERFACE PARA O MODELO DA TABELA
interface TableDataRow {
  valor: number;
  tipoDado: string;
  timestamp: string;
  nomeExperimento: string;
  nomeParticipante: string;
}

@Component({
  selector: 'app-experimento-dashboard',
  standalone: true,
  imports: [
    BaseChartDirective,
    CommonModule // <-- Adicionado para suportar *ngFor no template
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
      x: { 
        title: {
          display: true,
          text: 'Tipo de Frequência Cardíaca'
        }
      }
    }
  };
  public lineChartType: ChartType = 'bar'; 

  // 2. NOVAS PROPRIEDADES PARA A TABELA
  public tableData: TableDataRow[] = [];
  public experimentoNome: string = 'Carregando...'; 
  public participanteNome: string = 'Participante ID 1 (Assumido)';

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
    // Busca dados do dashboard
    this.experimentoService.getDashboardData(experimentoId).subscribe(
      (data: { frequenciaCardiaca: { labels: string[]; datasets: { label: string, data: number[] }[]; }; distribuicaoEmocoes: any; }) => {
        
        // 3. ATRIBUIÇÃO DO NOME DO EXPERIMENTO (Placeholder, pois o endpoint não retorna o nome)
        this.experimentoNome = `Experimento de Coleta #${experimentoId}`; 
        
        // Preenche os dados do gráfico
        this.lineChartData = {
          labels: data.frequenciaCardiaca.labels,
          datasets: data.frequenciaCardiaca.datasets
        };

        // 4. TRANSFORMA DADOS DO GRÁFICO EM DADOS DE TABELA
        this.tableData = this.transformarDadosParaTabela(data.frequenciaCardiaca);
      },
      error => {
          console.error('Erro ao carregar o dashboard:', error);
          this.experimentoNome = 'Erro ao carregar';
          this.participanteNome = 'Erro ao carregar';
      }
    );
  }

  // 5. NOVO MÉTODO: TRANSFORMA DADOS AGREGADOS DO GRÁFICO EM LINHAS DE TABELA
  transformarDadosParaTabela(chartData: { labels: string[]; datasets: { label: string, data: number[] }[]; }): TableDataRow[] {
      const table: TableDataRow[] = [];
      const dataset = chartData.datasets[0]; // Pega o primeiro (e único) dataset com os valores
      const dataHoraAtual = new Date().toLocaleTimeString('pt-BR'); 

      // Cria uma linha da tabela para cada rótulo de frequência (Min, Med, Max)
      chartData.labels.forEach((label, index) => {
          table.push({
              valor: dataset.data[index],
              tipoDado: label,
              timestamp: dataHoraAtual,
              nomeExperimento: this.experimentoNome, // Usa a propriedade definida na classe
              nomeParticipante: this.participanteNome // Usa a propriedade definida na classe
          });
      });

      return table;
  }
}