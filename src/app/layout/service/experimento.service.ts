// src/app/layout/service/experimento.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { AuthService } from '../../pages/service/auth.service';
import { Participante } from './participante.service'; // <-- 1. IMPORTE A INTERFACE PARTICIPANTE

/**
 * Interface para a CRIAÇÃO de um experimento.
 */
export interface ExperimentoRequest {
  nome: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  pesquisadorId: number;
  tipoEmocao: string;
  statusExperimento: string;
}

/**
 * Interface para a RESPOSTA do backend (o que é listado na tabela).
 */
export interface Experimento {
  id: number;
  nome: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  pesquisador: { id: number, nome: string };
  statusExperimento: string;
  tipoEmocao: string;
  participantes: Participante[]; // <-- 2. ADICIONE A PROPRIEDADE QUE FALTAVA
}


// Interfaces para a SESSÃO
export interface SessaoColetaRequest {
  experimentoId: number;
  participanteId: number;
}

export interface SessaoColetaResponse {
  codigo: string;
  dataExpiracao: string;
}

// Interface para o DASHBOARD
export interface DashboardDTO {
  frequenciaCardiaca: {
    labels: string[];
    datasets: { label: string; data: number[] }[];
  };
  distribuicaoEmocoes: {
    labels: string[];
    data: number[];
  };
}


@Injectable({
  providedIn: 'root'
})
export class ExperimentoService {

  private apiUrl = `${environment.apiUrl}/experimentos`;
  private sessoesApiUrl = `${environment.apiUrl}/sessoes`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private createAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
    return new HttpHeaders();
  }

  iniciarSessaoColeta(request: SessaoColetaRequest): Observable<SessaoColetaResponse> {
    const headers = this.createAuthHeaders();
    return this.http.post<SessaoColetaResponse>(`${this.sessoesApiUrl}/iniciar`, request, { headers: headers });
  }
  
  // --- MÉTODOS CRUD ---

  criarExperimento(formData: FormData): Observable<Experimento> {
    const headers = this.createAuthHeaders();
    return this.http.post<Experimento>(this.apiUrl, formData, { headers: headers });
  }

  getExperimentos(): Observable<Experimento[]> {
    const headers = this.createAuthHeaders();
    return this.http.get<Experimento[]>(this.apiUrl, { headers: headers });
  }

  getExperimentoById(id: number): Observable<Experimento> {
    const headers = this.createAuthHeaders();
    return this.http.get<Experimento>(`${this.apiUrl}/${id}`, { headers: headers });
  }

  updateExperimento(id: number, experimentoData: Partial<ExperimentoRequest>): Observable<Experimento> {
    const headers = this.createAuthHeaders();
    return this.http.put<Experimento>(`${this.apiUrl}/${id}`, experimentoData, { headers: headers });
  }

  deleteExperimento(id: number): Observable<void> {
    const headers = this.createAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: headers });
  }

  adicionarParticipante(idExperimento: number, idParticipante: number): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/${idExperimento}/participantes/${idParticipante}`, null, { headers: headers });
  }

  getDashboardData(experimentoId: number): Observable<DashboardDTO> {
    const headers = this.createAuthHeaders();
    return this.http.get<DashboardDTO>(`${this.apiUrl}/${experimentoId}/dashboard`, { headers: headers });
  }
}