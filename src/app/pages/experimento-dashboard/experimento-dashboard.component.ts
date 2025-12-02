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
import { ConfirmationService, MessageService } from 'primeng/api';
import { ImageModule } from 'primeng/image';
import { GalleriaModule } from 'primeng/galleria';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table'; 

// Imports do PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Import da Interface Original do Service
import { ExperimentoService, Experimento, Midia } from '../../layout/service/experimento.service';

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
    GalleriaModule,
    ConfirmDialogModule,
    TableModule
  ],
  templateUrl: './experimento-dashboard.component.html',
  styleUrls: ['./experimento-dashboard.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class ExperimentoDashboardComponent implements OnInit {

  experimento: Experimento | null = null;
  selectedFiles: File[] = []; 
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
  
  // Opções para a galeria ser responsiva
  responsiveOptions: any[] = [
    { breakpoint: '1024px', numVisible: 5 },
    { breakpoint: '768px', numVisible: 3 },
    { breakpoint: '560px', numVisible: 1 }
  ];

  isLoadingSalvar: boolean = false;

  constructor(
    private experimentoService: ExperimentoService, 
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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
        if(data && data.frequenciaCardiaca) {
            this.lineChartData = {
              labels: data.frequenciaCardiaca.labels,
              datasets: data.frequenciaCardiaca.datasets
            };
            this.tableData = this.transformarDadosParaTabela(data.frequenciaCardiaca);
        }
      },
      error => console.error('Erro dashboard:', error)
    );
  }

  carregarDetalhesExperimento(id: number): void {
      this.experimentoService.getExperimentoById(id).subscribe(
          (data) => {
              // TRUQUE DO REACTIVE: Cria um novo objeto para forçar atualização da tela (Galeria)
              this.experimento = { ...data };
              
              if (!this.experimento.midias) {
                this.experimento.midias = []; 
              }
              if (!this.experimento.participantes) {
                this.experimento.participantes = [];
              }
          },
          err => console.error("Erro experimento", err)
      );
  }

  transformarDadosParaTabela(chartData: any): TableDataRow[] {
      const table: TableDataRow[] = [];
      if (!chartData || !chartData.datasets || chartData.datasets.length === 0) return table;
      const dataset = chartData.datasets[0]; 
      if(chartData.labels) {
        chartData.labels.forEach((label: string, index: number) => {
            table.push({ valor: dataset.data[index], tipoDado: label });
        });
      }
      return table;
  }

  // --- MÉTODOS DE MÍDIA ---
  isImage(midia: Midia): boolean {
      return midia?.tipo?.startsWith('image') ?? false;
  }
  
  isVideo(midia: Midia): boolean {
      return midia?.tipo?.startsWith('video') ?? false;
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  alterarMidia(): void {
    if (!this.experimento || !this.experimento.id || this.selectedFiles.length === 0) {
      this.messageService.add({severity:'warn', summary:'Atenção', detail:'Selecione arquivos primeiro.'});
      return;
    }

    this.isLoadingMidia = true;
    const formData = new FormData();
    for (const file of this.selectedFiles) {
        formData.append('midia', file, file.name);
    }

    this.experimentoService.updateExperimentoMidia(this.experimento.id, formData).subscribe({
      next: () => {
        this.messageService.add({severity:'success', summary:'Sucesso', detail:'Mídias enviadas!'});
        this.selectedFiles = []; // Limpa a seleção
        
        // RECARREGA OS DADOS PARA NÃO PRECISAR DAR F5
        if (this.experimento) {
            this.carregarDetalhesExperimento(this.experimento.id);
        }
        
        this.isLoadingMidia = false;
      },
      error: (err) => {
        console.error('Erro upload:', err);
        this.messageService.add({severity:'error', summary:'Erro', detail:'Falha no upload.'});
        this.isLoadingMidia = false;
      }
    });
  }

  deletarMidia(midia: Midia): void {
    this.confirmationService.confirm({
        message: `Tem certeza que deseja remover a mídia "${midia.nome}"?`,
        header: 'Confirmar Exclusão',
        icon: 'pi pi-trash',
        accept: () => {
            this.experimentoService.deleteMidia(midia.id).subscribe({
                next: () => {
                    this.messageService.add({severity:'success', summary:'Sucesso', detail:'Mídia removida.'});
                    // Remove localmente para ser instantâneo
                    if (this.experimento && this.experimento.midias) {
                        this.experimento.midias = this.experimento.midias.filter(m => m.id !== midia.id);
                        // Força atualização visual
                        this.experimento = { ...this.experimento };
                    }
                },
                error: () => {
                    this.messageService.add({severity:'error', summary:'Erro', detail:'Não foi possível remover a mídia.'});
                }
            });
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
          tipoEmocao: this.experimento.resultadoEmocional
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
  
  // Função auxiliar para converter imagem com segurança (CORS)
  private getImageBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous'; 
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          try {
             resolve(canvas.toDataURL('image/png'));
          } catch (e) {
             reject(new Error('CORS Error'));
          }
        } else { reject(new Error('Erro canvas')); }
      };
      img.onerror = (e) => reject(new Error('Erro load img'));
    });
  }

  // VVVV RELATÓRIO PDF COMPLETO COM DADOS DO CADASTRO VVVV
  async gerarRelatorioPDF() {
    if (!this.experimento) {
        this.messageService.add({severity:'warn', summary:'Atenção', detail:'Carregue o experimento.'});
        return;
    }
    
    try {
        const doc = new jsPDF(); 
        const nomeRelatorio = `Relatorio_${this.experimento.nome ? this.experimento.nome.replace(/\s+/g, '_') : 'Experimento'}.pdf`;
        let y = 20; 
        const margin = 15;
        const pageWidth = doc.internal.pageSize.getWidth();
        
        // --- 1. TÍTULO DO RELATÓRIO ---
        doc.setFontSize(22); 
        doc.setTextColor(40); // Cinza escuro
        doc.setFont("helvetica", "bold");
        doc.text("RELATÓRIO VIBETRACK", pageWidth / 2, y, { align: 'center' }); 
        y += 15;
        
        // --- 2. GRID DE DETALHES DO CADASTRO ---
        doc.setFontSize(12);
        doc.setTextColor(0); 
        doc.setFont("helvetica", "bold");
        doc.text("Detalhes do Experimento", margin, y);
        
        // Linha divisória
        y += 2;
        doc.setLineWidth(0.5);
        doc.setDrawColor(200); 
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;

        // Configuração das Colunas
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const col1 = margin;
        const col2 = pageWidth / 2 + 10; 
        const lineHeight = 7;

        // -- COLUNA ESQUERDA --
        // Nome
        doc.setFont("helvetica", "bold"); doc.text("Experimento:", col1, y);
        doc.setFont("helvetica", "normal"); doc.text(this.experimento.nome || '-', col1 + 30, y);
        y += lineHeight;

        // Pesquisador
        doc.setFont("helvetica", "bold"); doc.text("Pesquisador:", col1, y);
        doc.setFont("helvetica", "normal"); doc.text(this.experimento.pesquisador?.nome || '-', col1 + 30, y);
        y += lineHeight;

        // Status
        doc.setFont("helvetica", "bold"); doc.text("Status:", col1, y);
        doc.setFont("helvetica", "normal"); doc.text(this.experimento.statusExperimento || '-', col1 + 30, y);
        y += lineHeight;

        // Emoção Alvo
        doc.setFont("helvetica", "bold"); doc.text("Emoção Alvo:", col1, y);
        doc.setFont("helvetica", "normal"); doc.text(this.experimento.resultadoEmocional || '-', col1 + 30, y);
        
        // -- RESETAR Y PARA COLUNA DIREITA --
        y -= (lineHeight * 3); 

        // -- COLUNA DIREITA --
       // -- Coluna Direita --
        // Participante Principal
        doc.setFont("helvetica", "bold"); doc.text("Part. Principal:", col2, y);
        
        // VVVV CORREÇÃO AQUI: Usamos 'as any' para o TypeScript aceitar .nome ou .nomeCompleto VVVV
        const partPrincipal = this.experimento.participantePrincipal as any;
        const nomePrincipal = partPrincipal?.nomeCompleto || partPrincipal?.nome || 'Não definido';
        // ^^^^ FIM DA CORREÇÃO ^^^^
        
        doc.setFont("helvetica", "normal"); doc.text(nomePrincipal, col2 + 30, y);
        y += lineHeight;
        
        // Data Início
        doc.setFont("helvetica", "bold"); doc.text("Data Início:", col2, y);
        const dataInicioFmt = this.experimento.dataInicio ? new Date(this.experimento.dataInicio).toLocaleDateString('pt-BR') : '-';
        doc.setFont("helvetica", "normal"); doc.text(dataInicioFmt, col2 + 30, y);
        y += lineHeight;

        // Data Fim
        doc.setFont("helvetica", "bold"); doc.text("Data Fim:", col2, y);
        const dataFimFmt = this.experimento.dataFim ? new Date(this.experimento.dataFim).toLocaleDateString('pt-BR') : '-';
        doc.setFont("helvetica", "normal"); doc.text(dataFimFmt, col2 + 30, y);
        y += lineHeight + 8; // Espaço extra

        // --- 3. LISTA DE INSCRITOS ---
        doc.setFontSize(14); 
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 102, 204); // Azul
        doc.text("Lista de Inscritos", margin, y); 
        y += 6;
        
        doc.setFontSize(10); 
        doc.setTextColor(0); 
        doc.setFont("helvetica", "normal");
        
        if (this.experimento.participantes && this.experimento.participantes.length > 0) {
            const nomes = this.experimento.participantes.map((p: any) => p.nomeCompleto || p.nome).join(', ');
            const splitNomes = doc.splitTextToSize(nomes, pageWidth - (margin * 2));
            doc.text(splitNomes, margin, y);
            y += (splitNomes.length * 5) + 8;
        } else {
            doc.text("Apenas o participante principal (se houver) ou nenhum inscrito.", margin, y); 
            y += 8;
        }

        // --- 4. DESCRIÇÃO/ANOTAÇÕES ---
        doc.setFontSize(14); 
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 102, 204);
        doc.text("Descrição do Ambiente / Anotações", margin, y); 
        y += 6;
        
        doc.setFontSize(10); 
        doc.setTextColor(0); 
        doc.setFont("helvetica", "normal");
        
        const textoDescricao = this.experimento.descricaoGeral || 'Sem descrição do ambiente registrada.';
        const splitNotes = doc.splitTextToSize(textoDescricao, pageWidth - (margin * 2));
        doc.text(splitNotes, margin, y); 
        y += (splitNotes.length * 5) + 8;
        
        // --- 5. TABELA DE DADOS ---
        doc.setFontSize(14); 
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 102, 204);
        doc.text("Dados Coletados (BPM)", margin, y); 
        y += 4;
        
        const data = this.tableData.map(row => [row.tipoDado, row.valor.toString()]);
        
        autoTable(doc, {
            startY: y, 
            head: [["Tipo de Medição", "Valor (BPM)"]], 
            body: data,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] },
            margin: { left: margin, right: margin }
        });
        
        let finalY = (doc as any).lastAutoTable.finalY || y; 
        finalY += 15;

        // --- 6. IMAGEM ---
        if (this.experimento.midias && this.experimento.midias.length > 0) {
             const primeiraImagem = this.experimento.midias.find(m => m.tipo && m.tipo.startsWith('image'));
             
             if (primeiraImagem) {
                try {
                    // Tenta carregar imagem com proteção de erro
                    const imgData = await this.getImageBase64(primeiraImagem.url).catch(() => null);

                    if (imgData) {
                        if (finalY + 90 > 280) { 
                            doc.addPage(); 
                            finalY = 20; 
                        }
                        
                        doc.setFontSize(14);
                        doc.setFont("helvetica", "bold");
                        doc.setTextColor(0, 102, 204);
                        doc.text("Mídia Anexada:", margin, finalY);
                        
                        const imgWidth = 160;
                        const imgHeight = 90;
                        const xImg = (pageWidth - imgWidth) / 2; // Centralizar
                        
                        doc.addImage(imgData, 'PNG', xImg, finalY + 5, imgWidth, imgHeight);
                    }
                } catch (e) { 
                    console.warn("Imagem ignorada no PDF (CORS/Erro).", e); 
                }
             }
        }
        
        doc.save(nomeRelatorio);

    } catch (error: any) {
        console.error("Erro PDF:", error);
        this.messageService.add({severity:'error', summary:'Erro PDF', detail: 'Erro ao gerar documento. Verifique o console.'});
    }
  }
}