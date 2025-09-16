import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { AuthService } from '../../pages/service/auth.service';// <-- VERIFIQUE SE O CAMINHO ESTÁ CORRETO

export interface ExperimentoRequest {
  nome: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  pesquisadorId: number;
  tipoEmocao: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExperimentoService {

  private apiUrl = `${environment.apiUrl}/experimentos`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Função auxiliar privada para criar os cabeçalhos de autenticação
  private createAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
    // Retorna cabeçalhos vazios se não houver token
    return new HttpHeaders();
  }

  /**
   * MÉTODO MODIFICADO: Aceita FormData e adiciona o token manualmente.
   */
  criarExperimento(formData: FormData): Observable<any> {
    const headers = this.createAuthHeaders();
    // Para FormData, não definimos 'Content-Type'. O navegador faz isso.
    return this.http.post<any>(this.apiUrl, formData, { headers: headers });
  }

  /**
   * MÉTODO MODIFICADO: Adiciona o token manualmente.
   */
  getExperimentoById(id: number): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: headers });
  }

  /**
   * MÉTODO MODIFICADO: Adiciona o token manualmente.
   */
  adicionarParticipante(idExperimento: number, idParticipante: number): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/${idExperimento}/participantes/${idParticipante}`, null, { headers: headers });
  }

  /**
   * MÉTODO MODIFICADO: Adiciona o token manualmente.
   */
  getExperimentos(): Observable<any[]> {
    const headers = this.createAuthHeaders();
    return this.http.get<any[]>(this.apiUrl, { headers: headers });
  }
}