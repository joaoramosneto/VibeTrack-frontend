// Em: src/app/pages/analise-bpm/analise-bpm.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber'; 
import { CardModule } from 'primeng/card'; 
import { AnalysisService, AnalysisResponse } from '../service/analysis.service'; 
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-analise-bpm',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputNumberModule, 
    CardModule,
    ToastModule
  ],
  templateUrl: './analise-bpm.component.html',
  // Lembre-se, nós removemos a linha 'styleUrls' para corrigir o erro anterior
  providers: [MessageService] 
})
export class AnaliseBpmComponent {

  bpmInput: number | null = null; 
  isLoading: boolean = false;
  resultado: AnalysisResponse | null = null; 

  constructor(
    private analysisService: AnalysisService,
    private messageService: MessageService
  ) { }

  onAnalisarClick(): void {
    if (!this.bpmInput || this.bpmInput <= 0) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Por favor, insira um valor de BPM válido.' });
      return;
    }

    this.isLoading = true;
    this.resultado = null; 

    this.analysisService.predictEmotion(this.bpmInput).subscribe({
      // vvvv CORREÇÃO AQUI (TS7006) vvvv
      next: (response: AnalysisResponse) => {
        this.isLoading = false;
        this.resultado = response;
      },
      // vvvv CORREÇÃO AQUI (TS7006) vvvv
      error: (err: any) => { 
        this.isLoading = false;
        console.error('Erro ao analisar BPM', err);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível conectar ao serviço de análise.' });
      }
    });
  }
}