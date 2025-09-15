import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { authGuard } from '../src/app/guards/auth.guard';

// 1. Imports dos seus novos componentes
import { ExperimentosComponent } from './app/pages/experimentos/experimentos.component'; // Listagem
import { CadastroExperimentoComponent } from './app/pages/cadastro-experimento/cadastro-experimento'; // Cadastro
import { ExperimentoDetalhesComponent } from './app/pages/experimento-detalhes/experimento-detalhes.component'; // Detalhes
import { CadastroParticipanteComponent } from './app/pages/cadastro-participante/cadastro-participante'; // Cadastro Participante


export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            // Redireciona a rota vazia para o dashboard
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

            // Rotas principais
            { path: 'dashboard', component: Dashboard },

            // Rotas de Experimentos
            { path: 'experimentos', component: ExperimentosComponent }, // Rota para a lista
            { path: 'cadastro-experimento', component: CadastroExperimentoComponent }, // Rota para o formulário de cadastro
            { path: 'experimentos/:id', component: ExperimentoDetalhesComponent }, // Rota para detalhes de um experimento

            // Rota de Participantes
            { path: 'participantes/novo', component: CadastroParticipanteComponent },
        ]
    },
    // Rota de autenticação
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },

    // Rota "catch-all" para qualquer outra URL não encontrada
    { path: '**', redirectTo: '/dashboard' }
];