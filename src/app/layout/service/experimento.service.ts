// src/app/services/experimento.service.ts (exemplo de caminho)
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  getExperimentoById(id: number): Observable<any> {
  const token = localStorage.getItem('id_token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: headers });
}

// Associa um participante a um experimento
adicionarParticipante(idExperimento: number, idParticipante: number): Observable<any> {
  const token = localStorage.getItem('id_token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  // A requisição não precisa de corpo (body), apenas a URL
  return this.http.post<any>(`${this.apiUrl}/${idExperimento}/participantes/${idParticipante}`, null, { headers: headers });
}
 // <<-- ADICIONE ESTE MÉTODO -->>
  getExperimentos(): Observable<any[]> {
    const token = localStorage.getItem('id_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(this.apiUrl, { headers: headers });
  }
}