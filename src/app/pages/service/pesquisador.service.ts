import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { AuthService } from './auth.service';

// Interface para Registro (já existia)
export interface PesquisadorRequest {
  nome: string;
  email: string;
  senha: string;
}

// Interface para dados do Pesquisador (já existia)
export interface Pesquisador {
    id: number;
    nome: string;
    email: string;
    fotoUrl?: string;
}

// VVVV NOVA INTERFACE PARA TROCA DE SENHA VVVV
export interface ChangePasswordRequest {
    senhaAtual: string;
    novaSenha: string;
    confirmacaoSenha: string;
}
// ^^^^ FIM DA NOVA INTERFACE ^^^^

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

  // VVVV NOVO MÉTODO: CHAMADA PARA ALTERAR SENHA VVVV
  alterarSenha(dadosSenha: ChangePasswordRequest): Observable<any> {
    const headers = this.createAuthHeaders();
    // Chama o endpoint PUT /api/pesquisadores/me/senha
    return this.http.put(`${this.apiUrl}/me/senha`, dadosSenha, { headers: headers, responseType: 'text' });
  }
  // ^^^^ FIM DO NOVO MÉTODO ^^^^
}