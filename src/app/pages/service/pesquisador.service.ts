import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { AuthService } from './auth.service';


// This interface is already correctly exported
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
    // Adicione outros campos, como dataCadastro, se existirem no seu backend

}

@Injectable({
  providedIn: 'root'
})
// ADD THE 'export' KEYWORD HERE
export class PesquisadorService {

  private apiUrl = `${environment.apiUrl}/pesquisadores`;

  constructor(private http: HttpClient, private authService: AuthService) { }

   // 1. MÉTODO PARA CRIAR OS HEADERS (ESTE ESTAVA FALTANDO OU INCORRETO)
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
}