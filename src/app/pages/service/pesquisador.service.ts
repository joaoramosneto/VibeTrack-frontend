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

  // Garante que a URL base termine sem barra e adiciona o endpoint
  private apiUrl = `${environment.apiUrl}/pesquisadores`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Método auxiliar para criar o cabeçalho com o Token
  private createAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Criar novo pesquisador (Geralmente rota pública, mas se precisar de token, adicione os headers)
  criarPesquisador(pesquisadorData: PesquisadorRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, pesquisadorData);
  }
  
  // Buscar por ID
  getPesquisadorById(id: number): Observable<Pesquisador> {
    const headers = this.createAuthHeaders();
    return this.http.get<Pesquisador>(`${this.apiUrl}/${id}`, { headers: headers });
  }

  // LISTAR TODOS (Método que vamos usar agora)
  listarTodos(): Observable<Pesquisador[]> {
    const headers = this.createAuthHeaders();
    return this.http.get<Pesquisador[]>(this.apiUrl, { headers: headers });
  }

  // Alterar senha
  alterarSenha(dadosSenha: ChangePasswordRequest): Observable<any> {
    const headers = this.createAuthHeaders();
    // responseType: 'text' é importante se o backend retornar apenas uma String e não um JSON
    return this.http.put(`${this.apiUrl}/me/senha`, dadosSenha, { headers: headers, responseType: 'text' });
  }
}