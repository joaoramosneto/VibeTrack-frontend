import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';


// This interface is already correctly exported
export interface PesquisadorRequest {
  nome: string;
  email: string;
  senha: string;
}

@Injectable({
  providedIn: 'root'
})
// ADD THE 'export' KEYWORD HERE
export class PesquisadorService {

  private apiUrl = `${environment.apiUrl}/pesquisadores`;

  constructor(private http: HttpClient) { }

  criarPesquisador(pesquisadorData: PesquisadorRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, pesquisadorData);
  }
}