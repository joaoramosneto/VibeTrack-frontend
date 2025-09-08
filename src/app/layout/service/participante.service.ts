import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

// Interface para os dados do formulário (bate com o ParticipanteRequestDTO)
export interface ParticipanteRequest {
  nomeCompleto: string;
  email: string;
  dataNascimento: string; // Enviar como 'YYYY-MM-DD'
}

@Injectable({
  providedIn: 'root'
})
export class ParticipanteService {

  private apiUrl = `${environment.apiUrl}/participantes`;

  constructor(private http: HttpClient) { }

  criarParticipante(participanteData: ParticipanteRequest): Observable<any> {
    // 1. Pega o token do localStorage
    const token = localStorage.getItem('id_token');

    // 2. Se não houver token, a requisição falhará (o que é bom)
    if (!token) {
      throw new Error("Token não encontrado. Faça o login novamente.");
    }

    // 3. Cria os cabeçalhos (Headers) com o token de autorização
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    // 4. Faz a requisição POST, passando os dados e os cabeçalhos
    return this.http.post<any>(this.apiUrl, participanteData, { headers: headers });
  }

  // Futuramente, você adicionaria outros métodos aqui (get, update, delete)...
  getParticipantes(): Observable<any[]> {
  const token = localStorage.getItem('id_token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.get<any[]>(this.apiUrl, { headers: headers });
}
}