// Em: src/app/pages/auth/reset-password/reset-password.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // Importa ActivatedRoute e Router
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password'; // Módulo de senha
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    PasswordModule, // Adiciona o PasswordModule
    ToastModule
  ],
  templateUrl: './reset-password.component.html',
  providers: [MessageService]
})
export class ResetPasswordComponent implements OnInit {

  // Variáveis para o formulário
  token: string | null = null;
  password: string = '';
  confirmPassword: string = '';

  // Variáveis de estado
  isLoading: boolean = false;
  isSuccess: boolean = false;

  constructor(
    private route: ActivatedRoute, // Para ler a URL
    private router: Router,       // Para navegar para o login no final
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    // 1. Pega o token da URL assim que a página carrega
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');
      if (!this.token) {
        // Se não houver token, é um erro.
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Token de redefinição inválido ou ausente.' });
        this.isLoading = true; // Trava a tela
      }
    });
  }

  onSubmit(): void {
    // 2. Validações
    if (!this.password || !this.confirmPassword) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Por favor, preencha as duas senhas.' });
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'As senhas não coincidem.' });
      return;
    }
    if (!this.token) {
       this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Token inválido. Solicite um novo link.' });
       return;
    }

    this.isLoading = true;

    // 3. Simulação da chamada de API
    // (O próximo passo será criar este método no AuthService)
    console.log('Enviando para o backend:', this.token, this.password);

    setTimeout(() => {
      this.isLoading = false;
      this.isSuccess = true; // Mostra a tela de sucesso
    }, 2000);

    // O PRÓXIMO PASSO SERÁ SUBSTITUIR O 'setTimeout' POR ISTO:
    /*
    this.authService.resetPassword(this.token, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccess = true; // Mostra a tela de sucesso
      },
      error: (err) => {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error.message || 'Não foi possível redefinir a senha.' });
      }
    });
    */
  }
}