// src/app/services/experimento.service.ts (exemplo de caminho)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';



// (Opcional) Interface para o que você envia
export interface ExperimentoRequest {
  nome: string;
  descricao: string;
  dataInicio: string; // Enviar como string no formato 'YYYY-MM-DD'
  dataFim: string;
  pesquisadorId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExperimentoService {

  private apiUrl = `${environment.apiUrl}/experimentos`;

  constructor(private http: HttpClient) { }

  // Método para CRIAR um novo experimento
  criarExperimento(experimentoData: ExperimentoRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, experimentoData);
  }

  // ... (outros métodos como getExperimentos, etc.)
}