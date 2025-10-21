import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; 
import { RouterModule, Router, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider'; 
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api'; // Adicionar ConfirmationService
import { ConfirmDialogModule } from 'primeng/confirmdialog'; // Adicionar ConfirmDialogModule

// Serviços e Interfaces
import { AuthService } from '../service/auth.service';
import { Pesquisador, PesquisadorService } from '../service/pesquisador.service'; 

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,     
    CardModule,     
    ButtonModule,   
    AvatarModule,   
    DividerModule,  
    ToastModule,
    ConfirmDialogModule // MÓDULO NECESSÁRIO PARA O DIÁLOGO DE CONFIRMAÇÃO
  ],
  // CONTEÚDO HTML ATUALIZADO: Botão Editar removido e botão Sair modificado
  template: `
    <p-toast></p-toast>
    <p-confirmDialog [style]="{width: '50vw'}"></p-confirmDialog>

    <div *ngIf="loading" class="card">
        <div class="font-semibold text-xl mb-4">Carregando dados do perfil...</div>
    </div>

    <div *ngIf="!loading && pesquisador" class="grid">
        <div class="col-12 md:col-8 lg:col-6 lg:col-offset-3 md:col-offset-2">
            <p-card styleClass="p-2">
                
                <div class="flex flex-col items-center py-6">
                    <div class="mb-4">
                        
                        <img *ngIf="pesquisadorFotoUrl" 
                            [src]="pesquisadorFotoUrl" 
                            alt="User Avatar" 
                            class="w-[120px] h-[120px] rounded-full shadow-lg" />
                        
                        <p-avatar *ngIf="!pesquisadorFotoUrl" 
                                  [label]="getInitials()" 
                                  size="xlarge"
                                  shape="circle" 
                                  styleClass="w-[120px] h-[120px] text-4xl shadow-lg flex items-center justify-center surface-300 text-surface-900">
                        </p-avatar>
                    </div>
                    
                    <h2 class="text-3xl font-bold mb-1 text-surface-900 dark:text-surface-0">
                        {{ pesquisador.nome }}
                    </h2>
                    <span class="text-muted-color text-lg">Pesquisador(a) do VibeTrack</span>

                    <div class="flex gap-4 mt-4">
                        <p-button 
                            label="Deletar Conta" 
                            icon="pi pi-trash" 
                            severity="danger" 
                            styleClass="p-button-sm p-button-outlined" 
                            (click)="deletarConta()">
                        </p-button>
                        <p-button 
                            label="Sair" 
                            icon="pi pi-sign-out" 
                            styleClass="p-button-sm" 
                            (click)="logout()">
                        </p-button>
                    </div>
                </div>

                <p-divider></p-divider>

                <div class="p-4 flex flex-col gap-3">
                    
                    <div class="flex items-center gap-3">
                        <i class="pi pi-envelope text-xl text-primary"></i>
                        <div>
                            <span class="block text-sm text-muted-color">Email</span>
                            <span class="font-medium text-surface-900 dark:text-surface-0">{{ pesquisador.email }}</span>
                        </div>
                    </div>

                
                </div>
                
                <p-divider></p-divider>

                <div class="p-4">
                    <h5 class="text-xl font-semibold mb-3 text-surface-900 dark:text-surface-0">Configurações Rápidas</h5>
                    <ul class="list-none p-0 m-0 flex flex-col gap-2">
                        <li class="p-link flex items-center justify-between p-3 hover:bg-surface-50 dark:hover:bg-surface-800 rounded-border transition-colors cursor-pointer" routerLink="/auth/alterar-senha">
                            <span class="flex items-center">
                                <i class="pi pi-lock mr-3 text-lg text-primary"></i>
                                Alterar Senha
                            </span>
                            <i class="pi pi-chevron-right"></i>
                        </li>
                    </ul>
                </div>

            </p-card>
        </div>
    </div>
`, 
  providers: [MessageService, DatePipe, ConfirmationService] // ADICIONAR ConfirmationService
})
export class PerfilUsuarioComponent implements OnInit {

  pesquisador: Pesquisador | null = null;
  loading: boolean = true;
  pesquisadorFotoUrl: string | null = null; 

  constructor(
    private authService: AuthService, 
    private pesquisadorService: PesquisadorService, 
    private messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService // INJETAR O SERVIÇO DE CONFIRMAÇÃO
  ) {}

  ngOnInit(): void {
    this.carregarDadosDoPerfil();
  }

  carregarDadosDoPerfil(): void {
    this.loading = true; 
    const userId = this.authService.getPesquisadorId(); 

    if (userId) {
      this.pesquisadorService.getPesquisadorById(userId).subscribe({ 
        next: (data) => {
          this.pesquisador = data;
          if (data.fotoUrl) {
              this.pesquisadorFotoUrl = data.fotoUrl;
          }
          this.loading = false;
          console.log('PERFIL SUCESSO: Renderizando conteúdo.');
        },
        error: (err) => {
          this.loading = false;
          console.error('PERFIL ERRO: Falha na API.', err);
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar dados do perfil.' });
        }
      });
    } else {
      this.loading = false;
      this.messageService.add({ severity: 'warn', summary: 'Não Autenticado', detail: 'Sessão expirada. Faça o login.' });
      this.router.navigate(['/auth/login']);
    }
  }

  // NOVO MÉTODO: Lidar com a exclusão de conta
  deletarConta(): void {
    if (!this.pesquisador) return;

    this.confirmationService.confirm({
        message: 'Tem certeza que deseja DELETAR PERMANENTEMENTE sua conta? Esta ação é IRREVERSÍVEL.',
        header: 'Confirmação de Exclusão de Conta',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Deletar',
        rejectLabel: 'Cancelar',
        acceptButtonStyleClass: 'p-button-danger',
        rejectButtonStyleClass: 'p-button-text',
        accept: () => {
            this.executarDelecao();
        }
    });
  }

  // Lógica real de exclusão (mockada no frontend, deve chamar a API)
  executarDelecao(): void {
    const userId = this.authService.getPesquisadorId();
    if (!userId) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'ID do usuário não encontrado.' });
        return;
    }

    // AQUI VOCÊ CHAMARIA O MÉTODO NO PesquisadorService PARA DELETAR A CONTA:
    // Ex: this.pesquisadorService.deletarPesquisador(userId).subscribe({ ... });

    // SIMULAÇÃO DE SUCESSO DE DELEÇÃO:
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Sua conta foi deletada com sucesso.' });
    this.authService.logout();
    this.router.navigate(['/auth/register']); // Redireciona para registro ou landing page
  }


  // MÉTODO ANTIGO: Deixado vazio para evitar erros de compilação, mas o botão foi removido do template.
  editarPerfil(): void {
    this.messageService.add({ severity: 'info', summary: 'Ação', detail: 'Funcionalidade de edição removida.' });
  }

  getInitials(): string {
      if (!this.pesquisador || !this.pesquisador.nome) {
          return '?';
      }
      const parts = this.pesquisador.nome.trim().split(/\s+/);
      
      if (parts.length === 1) {
          return parts[0].charAt(0).toUpperCase();
      }
      
      if (parts.length >= 2) {
          return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
      }
      
      return '?';
  }

  logout(): void {
    this.authService.logout(); 
    this.router.navigate(['/auth/login']);
  }

}