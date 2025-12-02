import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api'; 
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
import { ConfirmDialogModule } from 'primeng/confirmdialog'; 

// IMPORTS DO PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    RouterLink,
    ConfirmDialogModule
  ],
  templateUrl: './experimento-detalhes.component.html',
  providers: [MessageService, ConfirmationService]
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
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.carregarDetalhesExperimento(id);
    }
  }

  carregarDetalhesExperimento(id: number): void {
    this.experimentoService.getExperimentoById(id).subscribe(dados => {
      this.experimento = dados;
      this.carregarTodosParticipantes();
    });
  }

  carregarTodosParticipantes(): void {
    this.participanteService.getParticipantes().subscribe(dados => {
        if (this.experimento) {
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
            this.carregarDetalhesExperimento(this.experimento!.id);
        },
        error: () => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível adicionar o participante.' });
        }
    });
  }

  // --- LÓGICA DO PDF (ADICIONADA AQUI) ---

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

  async gerarRelatorioPDF() {
    if (!this.experimento) {
        this.messageService.add({severity:'warn', summary:'Atenção', detail:'Carregue o experimento.'});
        return;
    }
    
    try {
        const doc = new jsPDF(); 
        const nomeRelatorio = `Detalhes_${this.experimento.nome ? this.experimento.nome.replace(/\s+/g, '_') : 'Experimento'}.pdf`;
        let y = 20; 
        const margin = 15;
        const pageWidth = doc.internal.pageSize.getWidth();
        
        // 1. TÍTULO
        doc.setFontSize(22); 
        doc.setTextColor(40);
        doc.setFont("helvetica", "bold");
        doc.text("DETALHES DO EXPERIMENTO", pageWidth / 2, y, { align: 'center' }); 
        y += 15;
        
        // 2. GRID DE INFORMAÇÕES
        doc.setFontSize(12);
        doc.setTextColor(0); 
        doc.setFont("helvetica", "bold");
        doc.text("Ficha Técnica", margin, y);
        y += 2;
        doc.setLineWidth(0.5); doc.setDrawColor(200); 
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const col1 = margin;
        const col2 = pageWidth / 2 + 10; 
        const lineHeight = 7;

        // Coluna Esquerda
        doc.setFont("helvetica", "bold"); doc.text("Nome:", col1, y);
        doc.setFont("helvetica", "normal"); doc.text(this.experimento.nome || '-', col1 + 30, y);
        y += lineHeight;

        doc.setFont("helvetica", "bold"); doc.text("Pesquisador:", col1, y);
        doc.setFont("helvetica", "normal"); doc.text(this.experimento.pesquisador?.nome || '-', col1 + 30, y);
        y += lineHeight;

        doc.setFont("helvetica", "bold"); doc.text("Status:", col1, y);
        doc.setFont("helvetica", "normal"); doc.text(this.experimento.statusExperimento || '-', col1 + 30, y);
        y += lineHeight;

        doc.setFont("helvetica", "bold"); doc.text("Emoção Alvo:", col1, y);
        doc.setFont("helvetica", "normal"); doc.text(this.experimento.resultadoEmocional || '-', col1 + 30, y);
        
        y -= (lineHeight * 3); // Reset Y

        // Coluna Direita
        doc.setFont("helvetica", "bold"); doc.text("Part. Principal:", col2, y);
        const partPrincipal = this.experimento.participantePrincipal as any;
        const nomePrincipal = partPrincipal?.nomeCompleto || partPrincipal?.nome || 'Não definido';
        doc.setFont("helvetica", "normal"); doc.text(nomePrincipal, col2 + 30, y);
        y += lineHeight;

        doc.setFont("helvetica", "bold"); doc.text("Data Início:", col2, y);
        const dataInicioFmt = this.experimento.dataInicio ? new Date(this.experimento.dataInicio).toLocaleDateString('pt-BR') : '-';
        doc.setFont("helvetica", "normal"); doc.text(dataInicioFmt, col2 + 30, y);
        y += lineHeight;

        doc.setFont("helvetica", "bold"); doc.text("Data Fim:", col2, y);
        const dataFimFmt = this.experimento.dataFim ? new Date(this.experimento.dataFim).toLocaleDateString('pt-BR') : '-';
        doc.setFont("helvetica", "normal"); doc.text(dataFimFmt, col2 + 30, y);
        y += lineHeight + 8;

        // 3. LISTA DE INSCRITOS
        doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(0, 102, 204);
        doc.text("Participantes Inscritos", margin, y); 
        y += 6;
        
        doc.setFontSize(10); doc.setTextColor(0); doc.setFont("helvetica", "normal");
        
        if (this.experimento.participantes && this.experimento.participantes.length > 0) {
            const dadosParticipantes = this.experimento.participantes.map((p: any) => [
                p.nomeCompleto || p.nome,
                p.email || '-'
            ]);

            autoTable(doc, {
                startY: y,
                head: [['Nome', 'Email']],
                body: dadosParticipantes,
                theme: 'striped',
                headStyles: { fillColor: [41, 128, 185] },
                margin: { left: margin, right: margin }
            });
            y = (doc as any).lastAutoTable.finalY + 10;
        } else {
            doc.text("Nenhum participante inscrito.", margin, y); 
            y += 8;
        }

        // 4. ANOTAÇÕES
        doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(0, 102, 204);
        doc.text("Descrição do Ambiente", margin, y); 
        y += 6;
        
        doc.setFontSize(10); doc.setTextColor(0); doc.setFont("helvetica", "normal");
        const textoDescricao = this.experimento.descricaoGeral || 'Sem descrição.';
        const splitNotes = doc.splitTextToSize(textoDescricao, pageWidth - (margin * 2));
        doc.text(splitNotes, margin, y);
        y += (splitNotes.length * 5) + 10;

        // 5. IMAGEM
        if (this.experimento.midias && this.experimento.midias.length > 0) {
             const primeiraImagem = this.experimento.midias.find(m => m.tipo && m.tipo.startsWith('image'));
             if (primeiraImagem) {
                try {
                    const imgData = await this.getImageBase64(primeiraImagem.url).catch(() => null);
                    if (imgData) {
                        if (y + 90 > 280) { doc.addPage(); y = 20; }
                        doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(0, 102, 204);
                        doc.text("Mídia de Referência:", margin, y);
                        doc.addImage(imgData, 'PNG', (pageWidth - 160)/2, y + 5, 160, 90);
                    }
                } catch (e) { console.warn("Imagem ignorada."); }
             }
        }
        
        doc.save(nomeRelatorio);

    } catch (error: any) {
        console.error("Erro PDF:", error);
        this.messageService.add({severity:'error', summary:'Erro PDF', detail: 'Erro ao gerar documento.'});
    }
  }
}