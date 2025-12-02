import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { AuthService } from '../../pages/service/auth.service';
import { Participante } from './participante.service'; 

// VVVV 1. NOVA INTERFACE: Representa o objeto de mídia que vem do banco VVVV
export interface Midia {
  id: number;
  nome: string;
  tipo: string;
  url: string;
}
// ^^^^ FIM ^^^^

export interface ExperimentoRequest {
  nome: string;
  descricao: string; 
  dataInicio: string;
  dataFim: string;
  pesquisadorId: number;
  tipoEmocao: string;
  statusExperimento: string;
  participanteId?: number; 
}

export interface Experimento {
  id: number;
  nome: string;
  
  descricaoGeral: string;     
  resultadoEmocional: string; 
  
  dataInicio: string;
  dataFim: string;
  pesquisador: { id: number, nome: string };
  statusExperimento: string;
  
  participantes: Participante[];
  participantePrincipal?: Participante; 

  // VVVV 2. ATUALIZADO: Agora é uma lista de OBJETOS Midia VVVV
  midias: Midia[]; 
  // ^^^^ FIM ^^^^
}


export interface SessaoColetaRequest {
  experimentoId: number;
  participanteId: number;
}

export interface SessaoColetaResponse {
  codigo: string;
  dataExpiracao: string;
}

export interface DashboardDTO {
  frequenciaCardiaca: any;
  distribuicaoEmocoes: any;
}

@Injectable({
  providedIn: 'root'
})
export class ExperimentoService {

  private apiUrl = `${environment.apiUrl}/experimentos`;
  private midiasApiUrl = `${environment.apiUrl}/midias`; // Endpoint para deletar mídia individual
  private sessoesApiUrl = `${environment.apiUrl}/sessoes`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private createAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
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

  updateExperimentoMidia(id: number, formData: FormData): Observable<Experimento> {
    const headers = this.createAuthHeaders();
    return this.http.put<Experimento>(`${this.apiUrl}/${id}/midia`, formData, { headers: headers });
  }
  
  // VVVV 3. NOVO MÉTODO: Deletar uma mídia específica pelo ID VVVV
  deleteMidia(id: number): Observable<void> {
    const headers = this.createAuthHeaders();
    return this.http.delete<void>(`${this.midiasApiUrl}/${id}`, { headers: headers });
  }
  // ^^^^ FIM ^^^^

  getExperimentos(): Observable<Experimento[]> {
    const headers = this.createAuthHeaders();
    return this.http.get<Experimento[]>(this.apiUrl, { headers: headers });
  }

  getExperimentoById(id: number): Observable<Experimento> {
    const headers = this.createAuthHeaders();
    return this.http.get<Experimento>(`${this.apiUrl}/${id}`, { headers: headers });
  }

  updateExperimento(id: number, experimentoData: Partial<ExperimentoRequest>): Observable<Experimento> {
    const headers = this.createAuthHeaders().set('Content-Type', 'application/json');
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