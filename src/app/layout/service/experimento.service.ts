// src/app/layout/service/experimento.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { AuthService } from '../../pages/service/auth.service';

/**
 * Interface para a CRIAÇÃO de um experimento.
 * ATUALIZADO: Adicionado 'tipoEmocao' para consistência com o formulário.
 */
export interface ExperimentoRequest {
  nome: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  pesquisadorId: number;
  tipoEmocao: string;
}

/**
 * Interface para a RESPOSTA do backend (o que é listado na tabela).
 * CORRIGIDO: Removida a duplicata da interface.
 */
export interface Experimento {
  id: number;
  nome: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  pesquisador: { id: number, nome: string }; // Objeto aninhado
  // Adicione outros campos que você recebe da API
}

@Injectable({
  providedIn: 'root'
})
export class ExperimentoService {

  private apiUrl = `${environment.apiUrl}/experimentos`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Função auxiliar para criar os cabeçalhos de autenticação
  private createAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
    return new HttpHeaders();
  }

  // --- MÉTODOS CRUD COMPLETOS ---

  /**
   * Cria um novo experimento. Aceita FormData para envio de mídia.
   */
  criarExperimento(formData: FormData): Observable<Experimento> {
    const headers = this.createAuthHeaders();
    // Para FormData, não definimos 'Content-Type'. O navegador faz isso sozinho.
    return this.http.post<Experimento>(this.apiUrl, formData, { headers: headers });
  }

  /**
   * Busca todos os experimentos.
   */
  getExperimentos(): Observable<Experimento[]> {
    const headers = this.createAuthHeaders();
    return this.http.get<Experimento[]>(this.apiUrl, { headers: headers });
  }

  /**
   * Busca um experimento específico pelo seu ID.
   */
  getExperimentoById(id: number): Observable<Experimento> {
    const headers = this.createAuthHeaders();
    return this.http.get<Experimento>(`${this.apiUrl}/${id}`, { headers: headers });
  }

  /**
   * Atualiza um experimento existente.
   */
  updateExperimento(id: number, experimentoData: Partial<ExperimentoRequest>): Observable<Experimento> {
    const headers = this.createAuthHeaders();
    return this.http.put<Experimento>(`${this.apiUrl}/${id}`, experimentoData, { headers: headers });
  }

  /**
   * Deleta um experimento pelo seu ID.
   */
  deleteExperimento(id: number): Observable<void> {
    const headers = this.createAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: headers });
  }
  
  /**
   * Adiciona um participante a um experimento.
   */
  adicionarParticipante(idExperimento: number, idParticipante: number): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/${idExperimento}/participantes/${idParticipante}`, null, { headers: headers });
  }
}