import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { authGuard } from '../src/app/guards/auth.guard';

// 1. Imports dos seus novos componentes
import { ExperimentosComponent } from './app/pages/experimentos/experimentos.component'; // Listagem
import { ExperimentoDetalhesComponent } from './app/pages/experimento-detalhes/experimento-detalhes.component'; // Detalhes
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
=======
=======
>>>>>>> Stashed changes
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'participantes/novo', component: CadastroParticipanteComponent },
            { path: 'dashboard', component: Dashboard },
            { path: 'cadastro-experimento', component: CadastroExperimentoComponent },
            { path: 'experimentos/:id', component: ExperimentoDetalhesComponent },
            { path: 'experimentos', component: ExperimentosComponent } // Added route for listing experiments
        ]
    },
    // A ÁREA PÚBLICA DE AUTENTICAÇÃO
    {
        path: 'auth',
        loadChildren: () => import('./app/pages/auth/auth.routes')
    },
>>>>>>> Stashed changes

    // Rota "catch-all" para qualquer outra URL não encontrada
    { path: '**', redirectTo: '/dashboard' }
];