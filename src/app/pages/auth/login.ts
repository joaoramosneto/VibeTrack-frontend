import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { MessageService } from 'primeng/api'; 
import { AuthService, LoginRequest } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast'; // Importante para ver os erros

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule, 
        CheckboxModule, 
        InputTextModule, 
        PasswordModule, 
        FormsModule, 
        RouterModule, 
        RippleModule, 
        AppFloatingConfigurator,
        ToastModule // Adicione isso para o <p-toast> funcionar
    ],
    template: `
        <!-- O Toast é essencial para ver mensagens de erro -->
        <p-toast></p-toast>
        
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Bem vindo ao VibeTrack!</div>
                            <span class="text-muted-color font-medium">Não tem uma conta? 
                                <a routerLink="/auth/register" class="text-primary cursor-pointer font-bold">Registre-se</a>
                            </span>
                        </div>

                        <div>
                            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                            <input pInputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" [(ngModel)]="email" />

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Senha</label>
                            <p-password id="password1" [(ngModel)]="password" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                <div class="flex items-center">
                                    <p-checkbox [(ngModel)]="checked" id="rememberme1" binary class="mr-2"></p-checkbox>
                                    <label for="rememberme1">Lembrar de mim</label>
                                </div>
                                <!-- Link corrigido para o fluxo de senha -->
                                <a routerLink="/auth/forgot-password" class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Esqueceu sua senha?</a>
                            </div>

                            <!-- Adicionamos [loading] para feedback visual -->
                            <p-button label="Entrar" styleClass="w-full" [loading]="isLoading" (click)="onLoginClick()"></p-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    providers: [MessageService]
})
export class Login {
    email: string = '';
    password: string = '';
    checked: boolean = false;
    isLoading: boolean = false; // Controle do estado de carregamento

    constructor(
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService
    ) {}

    onLoginClick(): void {
        if (!this.email || !this.password) {
            this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Email e senha são obrigatórios.' });
            return;
        }

        this.isLoading = true; // Trava o botão

        const credentials: LoginRequest = {
            email: this.email,
            senha: this.password
        };

        this.authService.login(credentials).subscribe({
            next: (response) => {
                console.log('Login bem-sucedido!', response);
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Login realizado!' });
                
                // Pequeno delay para mostrar o sucesso
                setTimeout(() => {
                    this.isLoading = false;
                    // Redireciona EXPLICITAMENTE para /home
                    this.router.navigate(['/home']); 
                }, 500);
            },
            error: (err) => {
                console.error('Falha no login', err);
                this.isLoading = false; // Destrava o botão
                
                // Mostra o erro real se vier do backend, ou um genérico
                const msg = err.error?.message || 'Email ou senha inválidos.';
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: msg });
            }
        });
    }
}