import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { AuthService } from '../../pages/service/auth.service'; // <-- 1. Importar o AuthService

// Interface para os dados do formulário de CRIAÇÃO (já existia)
export interface ParticipanteRequest {
  nomeCompleto: string;
  email: string;
  dataNascimento: string;
}

// =================================================================
// ====> 2. ADICIONAR A INTERFACE PARA A RESPOSTA DA API <====
// =================================================================
export interface Participante {
  id: number;
  nomeCompleto: string;
  email: string;
  // Adicione outros campos que a sua API retorna (ex: telefone, dataNascimento, etc.)
}

@Injectable({
  providedIn: 'root'
})
export class ParticipanteService {

  private apiUrl = `${environment.apiUrl}/participantes`;

  constructor(
    private http: HttpClient,
    private authService: AuthService // <-- 3. Injetar o AuthService
  ) { }

  // 4. USAR O MÉTODO PADRÃO PARA CRIAR CABEÇALHOS DE AUTENTICAÇÃO
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
    // Ajustado para retornar um Observable<Participante>
    return this.http.post<Participante>(this.apiUrl, participanteData, { headers });
  }

  // 5. ATUALIZAR O MÉTODO PARA USAR A NOVA INTERFACE E O AUTHSERVICE
  getParticipantes(): Observable<Participante[]> {
    const headers = this.createAuthHeaders();
    return this.http.get<Participante[]>(this.apiUrl, { headers: headers });
  }
}