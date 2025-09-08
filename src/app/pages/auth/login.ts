import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api'; // Para mostrar mensagens de erro
import { AuthService, LoginRequest } from '../service/auth.service';


@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Bem vindo ao VibeTrack!</div>
                            <span class="text-muted-color font-medium">Sign in to continue</span>
                        </div>

                        <div>
                            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                            <input pInputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" [(ngModel)]="email" />

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                            <p-password id="password1" [(ngModel)]="password" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                <div class="flex items-center">
                                    <p-checkbox [(ngModel)]="checked" id="rememberme1" binary class="mr-2"></p-checkbox>
                                    <label for="rememberme1">Remember me</label>
                                </div>
                                <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
                            </div>
                            <p-button label="Sign In" styleClass="w-full" (click)="onLoginClick()"></p-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login {
    email: string = '';

    password: string = '';

    checked: boolean = false;

    // 1. Injete o AuthService, Router e MessageService
  constructor(
    private authService: AuthService,
    private router: Router,
     private messageService: MessageService
  ) {}

  // 2. Crie a função que será chamada pelo botão
  onLoginClick(): void {
    if (!this.email || !this.password) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Email e senha são obrigatórios.' });
      return;
    }

    const credentials: LoginRequest = {
      email: this.email,
      senha: this.password // O nome do campo deve ser 'senha' para bater com o DTO do backend
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login bem-sucedido!', response);
        // Redireciona para a página principal/dashboard após o login
        this.router.navigate(['/']); 
      },
      error: (err) => {
        console.error('Falha no login', err);
        // Mostra uma mensagem de erro para o usuário
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Email ou senha inválidos.' });
      }
    });
  }
}
