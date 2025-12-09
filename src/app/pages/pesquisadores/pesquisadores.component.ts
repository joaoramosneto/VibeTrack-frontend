import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

// Imports do PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { AvatarModule } from 'primeng/avatar'; 
// VVVV CORREÇÃO 1: Adicionar o módulo visual do Diálogo de Confirmação VVVV
import { ConfirmDialogModule } from 'primeng/confirmdialog'; 

// Serviços e Classes
import { MessageService, ConfirmationService } from 'primeng/api';
import { PesquisadorService, Pesquisador } from '../service/pesquisador.service';

@Component({
  selector: 'app-pesquisadores',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    TooltipModule,
    DialogModule,
    FormsModule,
    AvatarModule,
    // VVVV CORREÇÃO 2: Incluir o módulo na lista de imports do componente VVVV
    ConfirmDialogModule 
  ],
  templateUrl: './pesquisadores.component.html',
  styleUrls: ['./pesquisadores.component.scss'],
  providers: [MessageService, ConfirmationService] 
})
export class PesquisadoresComponent implements OnInit {

  pesquisadores: Pesquisador[] = [];
  isLoading: boolean = true;
  
  pesquisadorDialog: boolean = false;
  pesquisadorSelecionado: Pesquisador = { id: 0, nome: '', email: '' };
  globalFilter: string = '';

  constructor(
    private pesquisadorService: PesquisadorService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService // Injetado
  ) {}

  ngOnInit() {
    this.carregarPesquisadores();
  }

  carregarPesquisadores() {
    this.isLoading = true;
    this.pesquisadorService.listarTodos().subscribe({
      next: (dados) => {
        this.pesquisadores = dados;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erro', 
          detail: 'Falha ao carregar pesquisadores.' 
        });
        this.isLoading = false;
      }
    });
  }

  refresh() {
    this.carregarPesquisadores();
  }
  
  deletarPesquisador(pesquisador: Pesquisador) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o pesquisador ${pesquisador.nome}?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.pesquisadorService.deletarPesquisador(pesquisador.id).subscribe({
          next: () => {
            this.pesquisadores = this.pesquisadores.filter(p => p.id !== pesquisador.id);
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Sucesso', 
              detail: `Pesquisador ${pesquisador.nome} excluído.` 
            });
          },
          error: (error) => {
            console.error(error);
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Erro', 
              detail: 'Falha ao excluir pesquisador. Verifique se ele não tem experimentos ativos.' 
            });
          }
        });
      }
    });
  }
}