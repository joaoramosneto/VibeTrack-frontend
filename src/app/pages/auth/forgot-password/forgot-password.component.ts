// Em: src/app/pages/auth/forgot-password/forgot-password.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast'; // 1. Importar o Toast
import { MessageService } from 'primeng/api'; // 2. Importar o serviço de mensagem
import { AuthService } from '../../service/auth.service'; // 3. Importar o seu AuthService

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    ToastModule // 4. Adicionar ToastModule aos imports
  ],
  templateUrl: './forgot-password.component.html',
  providers: [MessageService] // 5. Adicionar o MessageService aos providers
})
export class ForgotPasswordComponent {

  email: string = '';
  isLoading: boolean = false;
  messageSent: boolean = false;

  constructor(
    // 6. Injetar os serviços
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  onSubmit(): void {
    if (!this.email) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Por favor, informe um e-mail.' });
      return;
    }

    this.isLoading = true;
    this.messageSent = false;
    
    // 7. A CHAMADA DE API REAL (Substituindo o setTimeout)
    this.authService.requestPasswordReset(this.email).subscribe({
      next: () => {
        // Sucesso!
        this.isLoading = false;
        this.messageSent = true; // Mostra a tela de sucesso
      },
      error: (err) => {
        // Falha!
        this.isLoading = false;
        console.error('Erro ao solicitar reset de senha', err);
        
        // Esta é a MENSAGEM GENÉRICA E SEGURA.
        // Nós NUNCA dizemos "e-mail não encontrado".
        // Apenas mostramos a tela de sucesso de qualquer forma,
        // para não dar dicas a hackers se um e-mail existe ou não.
        this.messageSent = true;
      }
    });
  }
}