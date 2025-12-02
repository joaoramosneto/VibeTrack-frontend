import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necessário para ngModel se for editar

// Imports do PrimeNG (Iguais ao seu exemplo)
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';

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
    FormsModule
  ],
  templateUrl: './pesquisadores.component.html',
  styleUrls: ['./pesquisadores.component.scss'], // Provavelmente ficará vazio
  providers: [MessageService, ConfirmationService] // Prover os serviços do PrimeNG
})
export class PesquisadoresComponent implements OnInit {

  pesquisadores: Pesquisador[] = [];
  isLoading: boolean = true;
  
  // Controle do Dialog de Visualização/Edição (se necessário no futuro)
  pesquisadorDialog: boolean = false;
  pesquisadorSelecionado: Pesquisador = { id: 0, nome: '', email: '' };

  constructor(
    private pesquisadorService: PesquisadorService,
    private messageService: MessageService
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
}