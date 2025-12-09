import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { AuthService } from '../../pages/service/auth.service'; 

// Interface para os dados do formulário de CRIAÇÃO (já existia)
export interface ParticipanteRequest {
  nomeCompleto: string;
  email: string;
  dataNascimento: string;
}

// Interface para a resposta da API (já existia)
export interface Participante {
  id: number;
  nomeCompleto: string;
  email: string;
  dataNascimento: string;
}

@Injectable({
  providedIn: 'root'
})
export class ParticipanteService {

  private apiUrl = `${environment.apiUrl}/participantes`;

  constructor(
    private http: HttpClient,
    private authService: AuthService 
  ) { }

  private createAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
    return new HttpHeaders();
  }

  criarParticipante(participanteData: ParticipanteRequest): Observable<Participante> {
    const headers = this.createAuthHeaders();
    return this.http.post<Participante>(this.apiUrl, participanteData, { headers });
  }

  getParticipantes(): Observable<Participante[]> {
    const headers = this.createAuthHeaders();
    return this.http.get<Participante[]>(this.apiUrl, { headers: headers });
  }
  
  // VVVV CORREÇÃO: NOVO MÉTODO DELETAR PARTICIPANTE VVVV
  deletarParticipante(id: number): Observable<void> {
    const headers = this.createAuthHeaders();
    // Faz a chamada DELETE para o Backend (Backend já está pronto)
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: headers });
  }
  // ^^^^ FIM DA CORREÇÃO ^^^^
}