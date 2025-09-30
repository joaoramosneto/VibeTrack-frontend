import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card'; // <-- NOVO IMPORT
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-verificacao',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    CardModule // <-- MÓDULO ADICIONADO AQUI
  ],
  templateUrl: './verificacao.component.html',
  providers: [MessageService]
})
export class VerificacaoComponent implements OnInit {

  codigo: string = '';
  userEmail: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userEmail = params['email'];
    });
  }

  onSubmit(): void {
    if (!this.codigo || this.codigo.length !== 6) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Por favor, insira o código de 6 dígitos.' });
      return;
    }

    this.authService.verificarCodigo(this.codigo).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Conta verificada! Redirecionando para o login.' });
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (err) => {
        const detail = err.error || 'Código inválido ou expirado. Tente novamente.';
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: detail });
      }
    });
  }
}