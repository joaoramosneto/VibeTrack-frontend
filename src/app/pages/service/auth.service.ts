import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

// Contrato para a resposta de LOGIN
export interface LoginResponse {
  token: string;
  nomeUsuario: string;
  pesquisadorId: number;
}

// Contrato para o pedido de LOGIN
export interface LoginRequest {
  email: string;
  senha: string;
}

// VVVV CONTRATO NOVO PARA O PEDIDO DE REGISTRO (CADASTRO) VVVV
export interface PesquisadorRequest {
    nome: string;
    email: string;
    senha: string;
}
// ^^^^ NOVO CONTRATO ^^^^

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // O endpoint base para autenticação é /api/auth
  private apiUrl = `${environment.apiUrl}/auth`; 
  // O endpoint para o recurso Pesquisador é /api/pesquisadores
  private pesquisadorApiUrl = `${environment.apiUrl}/pesquisadores`;

  constructor(private http: HttpClient) { }

  // 1. Método de Login (inalterado)
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.setSession(response);
      })
    );
  }

  // VVVV MÉTODO NOVO PARA CADASTRO VVVV
  criarPesquisador(pesquisadorData: PesquisadorRequest): Observable<any> {
    // Chama o endpoint de registro que criamos no backend: POST /api/pesquisadores
    return this.http.post(this.pesquisadorApiUrl, pesquisadorData);
  }
  // ^^^^ MÉTODO NOVO ^^^^

  logout(): void {
    localStorage.removeItem("id_token");
    localStorage.removeItem("pesquisador_id");
  }

  public isLoggedIn(): boolean {
    return localStorage.getItem('id_token') !== null;
  }

  public getPesquisadorId(): number | null {
    const id = localStorage.getItem('pesquisador_id');
    return id ? parseInt(id, 10) : null;
  }

  public getToken(): string | null {
    return localStorage.getItem('id_token');
  }

  verificarCodigo(codigo: string): Observable<any> {
    const url = `${this.apiUrl}/verificar-codigo`;
    return this.http.post(url, null, { params: { codigo: codigo }, responseType: 'text' });
  }

  private setSession(response: LoginResponse): void {
    localStorage.setItem('id_token', response.token);
    localStorage.setItem('pesquisador_id', response.pesquisadorId.toString());
  }
}