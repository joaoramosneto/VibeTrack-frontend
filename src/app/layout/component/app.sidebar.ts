import { Component, ElementRef, OnInit } from '@angular/core'; // Importar OnInit
import { CommonModule } from '@angular/common'; // Importar CommonModule para *ngIf
import { AppMenu } from './app.menu';
import { Pesquisador, PesquisadorService } from '../../pages/service/pesquisador.service'; // Ajuste o caminho conforme necessário
import { AuthService } from '../../pages/service/auth.service'; // Ajuste o caminho conforme necessário
import { AvatarModule } from 'primeng/avatar'; // Adicionar AvatarModule

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenu, CommonModule, AvatarModule], // Adicionar CommonModule e AvatarModule
    template: ` 
      <div class="layout-sidebar">
            <div class="layout-sidebar-profile">
                
                <img *ngIf="pesquisadorFotoUrl" 
                     [src]="pesquisadorFotoUrl" 
                     alt="User Avatar" 
                     class="layout-sidebar-profile-avatar" />
                
                <p-avatar *ngIf="!pesquisadorFotoUrl" 
                          [label]="getInitials()" 
                          styleClass="layout-sidebar-profile-avatar text-xl" 
                          shape="circle">
                </p-avatar>

                <h4 class="layout-sidebar-profile-name">{{ pesquisadorNome }}</h4>
                
                <span class="layout-sidebar-profile-role">Pesquisador</span>
            </div>
            <app-menu></app-menu>
        </div>
    `
})
export class AppSidebar implements OnInit { // Implementar OnInit
    
    // Variáveis que serão usadas no template
    pesquisadorNome: string = 'Carregando...';
    // Se a fotoUrl não vier da API, use o placeholder padrão
    pesquisadorFotoUrl: string | null = null;
    constructor(
        public el: ElementRef,
        private authService: AuthService, 
        private pesquisadorService: PesquisadorService 
    ) {}

    ngOnInit() {
        this.carregarDadosDoPesquisador();
    }

    carregarDadosDoPesquisador() {
        const userId = this.authService.getPesquisadorId();

        if (userId) {
            this.pesquisadorService.getPesquisadorById(userId).subscribe({
                next: (data: Pesquisador) => {
                    // 1. Atualiza o Nome
                    this.pesquisadorNome = data.nome;
                    
                    // 2. Atualiza a Foto
                    if (data.fotoUrl) {
                        this.pesquisadorFotoUrl = data.fotoUrl;
                    }
                    // Se 'fotoUrl' não vier, 'pesquisadorFotoUrl' mantém o valor padrão ('assets/layout/images/avatar.png')
                },
                error: (err) => {
                    console.error('Falha ao carregar dados do perfil na sidebar.', err);
                    this.pesquisadorNome = 'Usuário Desconhecido';
                    // Em caso de erro, você pode redirecionar ou simplesmente manter os placeholders
                }
            });
        }
    }
    getInitials(): string {
        if (!this.pesquisadorNome || this.pesquisadorNome === 'Carregando...' || this.pesquisadorNome === 'Usuário Desconhecido') {
            return '?';
        }
        const parts = this.pesquisadorNome.trim().split(/\s+/);
        
        // Se houver apenas uma palavra, usa a primeira letra
        if (parts.length === 1) {
            return parts[0].charAt(0).toUpperCase();
        }
        
        // Se houver mais de uma palavra, usa a primeira letra da primeira e da última palavra
        if (parts.length >= 2) {
            return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
        }
        
        return '?';
    }
}