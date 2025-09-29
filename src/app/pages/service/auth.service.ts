import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

export interface LoginResponse {
  token: string;
  nomeUsuario: string;
  pesquisadorId: number;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.setSession(response);
      })
    );
  }

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