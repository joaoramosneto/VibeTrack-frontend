// src/app/services/experimento.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

export interface ExperimentoRequest {
  nome: string;
  descricao: string;
  dataInicio: string; 
  dataFim: string;
  pesquisadorId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExperimentoService {

  private apiUrl = `${environment.apiUrl}/experimentos`;

  constructor(private http: HttpClient) { }

  // === MÉTODO CORRIGIDO AQUI ===
  criarExperimento(experimentoData: ExperimentoRequest): Observable<any> {
    // 1. Pega o token do localStorage
    const token = localStorage.getItem('id_token');

    // 2. Cria os cabeçalhos (Headers) com o token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    // 3. Faz a requisição POST, passando os cabeçalhos
    return this.http.post<any>(this.apiUrl, experimentoData, { headers: headers });
  }

  getExperimentoById(id: number): Observable<any> {
    const token = localStorage.getItem('id_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: headers });
  }

  adicionarParticipante(idExperimento: number, idParticipante: number): Observable<any> {
    const token = localStorage.getItem('id_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.apiUrl}/${idExperimento}/participantes/${idParticipante}`, null, { headers: headers });
  }

  getExperimentos(): Observable<any[]> {
    const token = localStorage.getItem('id_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(this.apiUrl, { headers: headers });
  }
}