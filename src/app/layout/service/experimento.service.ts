import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { AuthService } from '../../pages/service/auth.service'; // <-- VERIFIQUE O CAMINHO

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

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Função auxiliar para criar os cabeçalhos
  private createAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
    return new HttpHeaders();
  }

  /**
   * MÉTODO CORRIGIDO: Aceita FormData e adiciona o token manualmente.
   */
  criarExperimento(formData: FormData): Observable<any> {
    const headers = this.createAuthHeaders();
    // Para FormData, não definimos 'Content-Type'. O navegador faz isso sozinho.
    return this.http.post<any>(this.apiUrl, formData, { headers: headers });
  }

  // Métodos restantes com a adição manual do token
  getExperimentoById(id: number): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: headers });
  }

  adicionarParticipante(idExperimento: number, idParticipante: number): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/${idExperimento}/participantes/${idParticipante}`, null, { headers: headers });
  }

  getExperimentos(): Observable<any[]> {
    const headers = this.createAuthHeaders();
    return this.http.get<any[]>(this.apiUrl, { headers: headers });
  }
}