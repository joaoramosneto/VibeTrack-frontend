import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from  '../service/auth.service';
import { PesquisadorService, ChangePasswordRequest } from '../service/pesquisador.service'; // Ajuste o caminho do import se necessário
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    DividerModule,
    ToastModule,
    AvatarModule
  ],
  template: `
    <p-toast></p-toast>
    <div class="grid justify-content-center">
        <div class="col-12 md:col-10 lg:col-8">
            <div class="card p-fluid">
                
                <!-- Cabeçalho do Perfil -->
                <div class="flex align-items-center mb-5">
                    <p-avatar icon="pi pi-user" styleClass="mr-4" size="xlarge" shape="circle" [style]="{'background-color':'var(--primary-color)', 'color': '#ffffff'}"></p-avatar>
                    <div>
                        <div class="text-900 text-3xl font-medium mb-2">Meu Perfil</div>
                        <div class="text-500">Gerencie suas informações pessoais e segurança da conta.</div>
                    </div>
                </div>
                
                <p-divider styleClass="my-4"></p-divider>

                <!-- Seção de Dados Básicos -->
                <div class="text-900 text-xl font-medium mb-4">Informações Pessoais</div>
                
                <div class="formgrid grid">
                    <div class="field col-12 md:col-6 mb-4">
                        <label for="nome" class="font-medium text-900 mb-2 block">Nome Completo</label>
                        <span class="p-input-icon-left">
                            <i class="pi pi-user"></i>
                            <input pInputText id="nome" [value]="nomeUsuario" disabled class="w-full surface-100" />
                        </span>
                    </div>
                    <div class="field col-12 md:col-6 mb-4">
                        <label for="email" class="font-medium text-900 mb-2 block">Email</label>
                        <span class="p-input-icon-left">
                            <i class="pi pi-envelope"></i>
                            <input pInputText id="email" [value]="emailUsuario" disabled class="w-full surface-100" />
                        </span>
                    </div>
                </div>

                <p-divider styleClass="my-5"></p-divider>

                <!-- Seção de Segurança -->
                <div class="flex align-items-center mb-4">
                    <i class="pi pi-lock text-2xl mr-2 text-primary"></i>
                    <div class="text-900 text-xl font-medium">Alterar Senha</div>
                </div>

                <div class="grid formgrid">
                    <div class="field col-12 mb-4">
                        <label for="senhaAtual" class="font-medium text-900 mb-2 block">Senha Atual</label>
                        <p-password id="senhaAtual" 
                                    [(ngModel)]="senhaModel.senhaAtual" 
                                    [toggleMask]="true" 
                                    [feedback]="false"
                                    placeholder="Digite sua senha atual"
                                    styleClass="w-full"
                                    [inputStyle]="{'width':'100%'}"></p-password>
                    </div>
                    
                    <div class="field col-12 md:col-6 mb-4">
                        <label for="novaSenha" class="font-medium text-900 mb-2 block">Nova Senha</label>
                        <p-password id="novaSenha" 
                                    [(ngModel)]="senhaModel.novaSenha" 
                                    [toggleMask]="true" 
                                    [feedback]="true"
                                    placeholder="Crie uma nova senha"
                                    styleClass="w-full"
                                    [inputStyle]="{'width':'100%'}">
                            <ng-template pTemplate="header">
                                <h6>Segurança da Senha</h6>
                            </ng-template>
                            <ng-template pTemplate="footer">
                                <p-divider></p-divider>
                                <p class="mt-2">Requisitos:</p>
                                <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                                    <li>Pelo menos 8 caracteres</li>
                                    <li>Uma letra maiúscula e minúscula</li>
                                    <li>Um número</li>
                                </ul>
                            </ng-template>
                        </p-password>
                    </div>

                    <div class="field col-12 md:col-6 mb-4">
                        <label for="confirmacaoSenha" class="font-medium text-900 mb-2 block">Confirmar Nova Senha</label>
                        <p-password id="confirmacaoSenha" 
                                    [(ngModel)]="senhaModel.confirmacaoSenha" 
                                    [toggleMask]="true" 
                                    [feedback]="false"
                                    placeholder="Repita a nova senha"
                                    styleClass="w-full"
                                    [inputStyle]="{'width':'100%'}"></p-password>
                    </div>
                </div>

                <div class="flex justify-content-end mt-4">
                    <p-button label="Salvar Nova Senha" 
                              icon="pi pi-check" 
                              [loading]="isLoading" 
                              (click)="atualizarSenha()"
                              styleClass="p-button-primary w-full md:w-auto px-5"></p-button>
                </div>

            </div>
        </div>
    </div>
  `,
  providers: [MessageService]
})
export class PerfilUsuarioComponent implements OnInit {

  nomeUsuario: string = '';
  emailUsuario: string = '';
  
  senhaModel: ChangePasswordRequest = {
    senhaAtual: '',
    novaSenha: '',
    confirmacaoSenha: ''
  };

  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private pesquisadorService: PesquisadorService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const id = this.authService.getPesquisadorId();
    if (id) {
        this.pesquisadorService.getPesquisadorById(id).subscribe({
            next: (pesquisador) => {
                this.nomeUsuario = pesquisador.nome;
                this.emailUsuario = pesquisador.email;
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os dados do perfil.' });
            }
        });
    }
  }

  atualizarSenha() {
    if (!this.senhaModel.senhaAtual || !this.senhaModel.novaSenha || !this.senhaModel.confirmacaoSenha) {
        this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha todos os campos de senha.' });
        return;
    }

    if (this.senhaModel.novaSenha !== this.senhaModel.confirmacaoSenha) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'A nova senha e a confirmação não coincidem.' });
        return;
    }

    this.isLoading = true;

    this.pesquisadorService.alterarSenha(this.senhaModel).subscribe({
        next: () => {
            this.isLoading = false;
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Senha alterada com sucesso!' });
            this.senhaModel = { senhaAtual: '', novaSenha: '', confirmacaoSenha: '' };
        },
        error: (err) => {
            this.isLoading = false;
            const msg = err.error || 'Erro ao alterar senha.';
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: msg });
        }
    });
  }
}