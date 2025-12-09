import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { AuthService } from './auth.service';

// Interfaces exportadas para usar nos componentes
export interface PesquisadorRequest {
  nome: string;
  email: string;
  senha: string;
}

export interface Pesquisador {
  id: number;
  nome: string;
  email: string;
  fotoUrl?: string;
  ativo?: boolean;
}

export interface ChangePasswordRequest {
  senhaAtual: string;
  novaSenha: string;
  confirmacaoSenha: string;
}

@Injectable({
  providedIn: 'root'
})
export class PesquisadorService {

  private apiUrl = `${environment.apiUrl}/pesquisadores`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private createAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  criarPesquisador(pesquisadorData: PesquisadorRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, pesquisadorData);
  }
  
  getPesquisadorById(id: number): Observable<Pesquisador> {
    const headers = this.createAuthHeaders();
    return this.http.get<Pesquisador>(`${this.apiUrl}/${id}`, { headers: headers });
  }

  listarTodos(): Observable<Pesquisador[]> {
    const headers = this.createAuthHeaders();
    return this.http.get<Pesquisador[]>(this.apiUrl, { headers: headers });
  }

  // VVVV NOVO MÉTODO: DELETAR PESQUISADOR VVVV
  deletarPesquisador(id: number): Observable<void> {
    const headers = this.createAuthHeaders();
    // Faz um DELETE para /api/pesquisadores/{id}
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: headers });
  }
  // ^^^^ FIM DO NOVO MÉTODO ^^^^

  alterarSenha(dadosSenha: ChangePasswordRequest): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.put(`${this.apiUrl}/me/senha`, dadosSenha, { headers: headers, responseType: 'text' });
  }
}