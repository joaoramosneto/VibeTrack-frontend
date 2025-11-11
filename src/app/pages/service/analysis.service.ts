// Em: src/app/pages/service/analysis.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

// 1. PRECISAMOS EXPORTAR a interface (o erro TS2305)
export interface AnalysisResponse {
  emocaoDetectada: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {

  private apiUrl = `${environment.apiUrl}/analysis`;

  constructor(private http: HttpClient) { }

  /**
   * 2. PRECISAMOS DO MÉTODO 'predictEmotion' (o erro TS2339)
   * Envia o BPM para o backend e retorna a análise.
   * @param bpm A média de batimentos por minuto
   */
  public predictEmotion(bpm: number): Observable<AnalysisResponse> {
    
    const requestBody = { bpm: bpm };
    const url = `${this.apiUrl}/predict`;

    return this.http.post<AnalysisResponse>(url, requestBody);
  }
}