// Imports do Angular e PrimeNG (baseado no seu login.ts)
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';

// Imports corretos para a funcionalidade de REGISTRO
import { PesquisadorService, PesquisadorRequest } from '../service/pesquisador.service';

@Component({
  selector: 'app-register', // MUDANÇA 1: Seletor
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    RouterModule,
    RippleModule,
    ToastModule,
    AppFloatingConfigurator
  ],
  // MUDANÇA 2: Template adaptado para Registro
  template: `
    <p-toast></p-toast>
    <app-floating-configurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Criar Conta no VibeTrack</div>
                        <span class="text-muted-color font-medium">Já tem uma conta? <a routerLink="/auth/login" class="text-primary cursor-pointer ml-1">Faça login</a></span>
                    </div>
                    <div>
                        <label for="nome" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Nome</label>
                        <input pInputText id="nome" type="text" placeholder="Seu nome completo" class="w-full md:w-[30rem] mb-6" [(ngModel)]="pesquisadorModel.nome" />

                        <label for="email" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <input pInputText id="email" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-6" [(ngModel)]="pesquisadorModel.email" />

                        <label for="password" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Senha</label>
                        <p-password id="password" [(ngModel)]="pesquisadorModel.senha" placeholder="Crie uma senha" [toggleMask]="true" styleClass="mb-6" [fluid]="true" [feedback]="false"></p-password>

                        <p-button label="Registrar" styleClass="w-full" (click)="onSubmit()"></p-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `
})
// MUDANÇA 3: Nome da classe
export class RegisterComponent {
    // MUDANÇA 4: Modelo de dados para o formulário de registro
    pesquisadorModel: PesquisadorRequest = {
        nome: '',
        email: '',
        senha: ''
    };

    constructor(
        // MUDANÇA 5: Injetando o serviço correto
        private pesquisadorService: PesquisadorService,
        private router: Router,
        private messageService: MessageService
    ) {}

    // MUDANÇA 6: Lógica para o clique do botão de registro
    onSubmit(): void {
    console.log("Botão 'Registrar' foi clicado!"); // <-- LOG 1

    if (!this.pesquisadorModel.nome || !this.pesquisadorModel.email || !this.pesquisadorModel.senha) {
        console.error("Formulário inválido. Campos faltando."); // <-- LOG 2
        this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Todos os campos são obrigatórios.' });
        return;
    }

    console.log("Formulário válido. Chamando o serviço..."); // <-- LOG 3
    
    this.pesquisadorService.criarPesquisador(this.pesquisadorModel).subscribe({
      next: (response) => {
        console.log('Sucesso! Resposta do backend:', response); // <-- LOG 4
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cadastro realizado! Você já pode fazer o login.' });
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('ERRO na chamada da API:', err); // <-- LOG 5
        const detail = err.error?.message || 'Falha ao realizar o cadastro. Verifique os dados.';
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: detail });
      }
        });
    }
}