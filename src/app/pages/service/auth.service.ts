import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

// Interface para a requisição de login (deve bater com o seu LoginRequestDTO)
export interface LoginRequest {
  email: string;
  senha: string;
}

// Interface para a resposta do login (deve bater com o seu LoginResponseDTO)
export interface LoginResponse {
  token: string;
  nomeUsuario: string;
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
        // "Side-effect": Salva o token no navegador após o sucesso do login
        this.setSession(response.token);
      })
    );
  }

  logout(): void {
    // Limpa os dados da sessão
    localStorage.removeItem("id_token");
  }

  public isLoggedIn(): boolean {
    // Verifica se há um token
    return localStorage.getItem('id_token') !== null;
  }

  // vvv MÉTODO ADICIONADO AQUI vvv
  /**
   * Retorna o token de autenticação guardado.
   * Outros serviços (como o ExperimentoService) usarão este método.
   */
  public getToken(): string | null {
    return localStorage.getItem('id_token');
  }
  // ^^^ MÉTODO ADICIONADO AQUI ^^^

  private setSession(token: string): void {
    // Guarda o token no localStorage do navegador
    localStorage.setItem('id_token', token);
  }
}