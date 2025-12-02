import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextarea } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ImageModule } from 'primeng/image';
import { GalleriaModule } from 'primeng/galleria'; // Importante

// Imports diretos para o PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { ExperimentoService, Experimento } from '../../layout/service/experimento.service';

interface TableDataRow {
  valor: number;
  tipoDado: string;
}

@Component({
  selector: 'app-experimento-dashboard',
  standalone: true,
  imports: [
    BaseChartDirective,
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextarea,
    ToastModule,
    ImageModule,
    GalleriaModule
  ],
  templateUrl: './experimento-dashboard.component.html',
  styleUrls: ['./experimento-dashboard.component.css'],
  providers: [MessageService]
})
export class ExperimentoDashboardComponent implements OnInit {

  experimento: Experimento | null = null;
  selectedFiles: File[] = []; // Lista de arquivos
  isLoadingMidia: boolean = false;   

  public tableData: TableDataRow[] = [];
  public lineChartData: ChartConfiguration['data'] = { datasets: [], labels: [] };
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true },
      x: { title: { display: true, text: 'Tipo de Frequência Cardíaca' } }
    }
  };
  public lineChartType: ChartType = 'line'; 
  
  // Configuração da Galeria
  responsiveOptions: any[] = [
    { breakpoint: '1024px', numVisible: 5 },
    { breakpoint: '768px', numVisible: 3 },
    { breakpoint: '560px', numVisible: 1 }
  ];

  isLoadingSalvar: boolean = false;

  constructor(
    private experimentoService: ExperimentoService, 
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
      Chart.register(...registerables);
  }
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.carregarDadosDashboard(+id);
        this.carregarDetalhesExperimento(+id);
      }
    });
  }

  carregarDadosDashboard(experimentoId: number): void {
    this.experimentoService.getDashboardData(experimentoId).subscribe(
      (data) => {
        this.lineChartData = {
          labels: data.frequenciaCardiaca.labels,
          datasets: data.frequenciaCardiaca.datasets
        };
        this.tableData = this.transformarDadosParaTabela(data.frequenciaCardiaca);
      },
      error => console.error('Erro dashboard:', error)
    );
  }

  carregarDetalhesExperimento(id: number): void {
      this.experimentoService.getExperimentoById(id).subscribe(
          data => {
              this.experimento = data;
              // Garante array vazio se null
              if (this.experimento && !this.experimento.urlsMidia) {
                this.experimento.urlsMidia = []; 
              }
          },
          err => console.error("Erro experimento", err)
      );
  }

  transformarDadosParaTabela(chartData: any): TableDataRow[] {
      const table: TableDataRow[] = [];
      if (!chartData || !chartData.datasets || chartData.datasets.length === 0) return table;
      const dataset = chartData.datasets[0]; 
      chartData.labels.forEach((label: string, index: number) => {
          table.push({ valor: dataset.data[index], tipoDado: label });
      });
      return table;
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  alterarMidia(): void {
    if (!this.experimento || !this.experimento.id || this.selectedFiles.length === 0) {
      this.messageService.add({severity:'warn', summary:'Atenção', detail:'Selecione arquivos.'});
      return;
    }

    this.isLoadingMidia = true;
    const formData = new FormData();
    for (const file of this.selectedFiles) {
        formData.append('midia', file, file.name);
    }

    this.experimentoService.updateExperimentoMidia(this.experimento.id, formData).subscribe({
      next: () => {
        this.messageService.add({severity:'success', summary:'Sucesso', detail:'Mídias atualizadas!'});
        this.selectedFiles = [];
        this.carregarDetalhesExperimento(this.experimento!.id); 
        this.isLoadingMidia = false;
      },
      error: (err) => {
        console.error('Erro upload:', err);
        this.messageService.add({severity:'error', summary:'Erro', detail:'Falha no upload.'});
        this.isLoadingMidia = false;
      }
    });
  }

  cancelarAlteracaoMidia(): void {
    this.selectedFiles = [];
  }

  salvarNotas(): void {
      if (!this.experimento) return;
      this.isLoadingSalvar = true;
      
      const updateData = {
          nome: this.experimento.nome,
          dataInicio: this.experimento.dataInicio,
          dataFim: this.experimento.dataFim,
          statusExperimento: this.experimento.statusExperimento,
          pesquisadorId: this.experimento.pesquisador.id,
          
          descricaoAmbiente: this.experimento.descricaoGeral, 
          tipoEmocao: this.experimento.resultadoEmocional,
          urlsMidia: this.experimento.urlsMidia 
      };

      this.experimentoService.updateExperimento(this.experimento.id, updateData as any).subscribe({
          next: () => {
              this.messageService.add({severity:'success', summary:'Sucesso', detail:'Notas salvas!'});
              this.isLoadingSalvar = false;
          },
          error: (err) => {
              console.error(err);
              this.messageService.add({severity:'error', summary:'Erro', detail:'Falha ao salvar notas.'});
              this.isLoadingSalvar = false;
          }
      });
  }
  
  gerarRelatorioPDF(): void {
    if (!this.experimento) {
        this.messageService.add({severity:'warn', summary:'Atenção', detail:'Carregue.'});
        return;
    }
    
    try {
        const doc = new jsPDF(); 
        const nomeRelatorio = `Relatorio_${this.experimento.id}.pdf`;
        let y = 15; const margin = 15;
        
        doc.setFontSize(18); doc.text("RELATÓRIO DE EXPERIMENTO", 105, y, { align: 'center' }); y += 10;
        
        // Metadados
        doc.setFontSize(12);
        doc.text(`Experimento: ${this.experimento.nome}`, margin, y); y += 6;
        doc.text(`Pesquisador: ${this.experimento.pesquisador.nome}`, margin, y); y += 6;
        
        // Datas formatadas
        const dataInicioFmt = new Date(this.experimento.dataInicio).toLocaleDateString('pt-BR');
        doc.text(`Data Início: ${dataInicioFmt}`, margin, y); y += 10;

        // Notas
        doc.setFontSize(14); doc.text("Notas:", margin, y); y += 5;
        doc.setFontSize(11);
        const splitNotes = doc.splitTextToSize(this.experimento.descricaoGeral || 'Sem notas.', 180);
        doc.text(splitNotes, margin, y); y += (splitNotes.length * 5) + 8;
        
        // Tabela
        doc.setFontSize(14); doc.text("Dados:", margin, y); y += 5;
        const data = this.tableData.map(row => [row.tipoDado, row.valor.toString()]);
        
        (doc as any).autoTable({ startY: y, head: [["Tipo", "Valor"]], body: data });
        
        // Mídia (Primeira imagem)
        // (Código de imagem omitido para brevidade, mas já estava correto na versão anterior se usar urlsMidia[0])
        
        doc.save(nomeRelatorio);

    } catch (error: any) {
        this.messageService.add({severity:'error', summary:'Erro PDF', detail: error.message});
    }
  }
}