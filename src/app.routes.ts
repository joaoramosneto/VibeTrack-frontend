import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { authGuard } from '../src/app/guards/auth.guard';

// 1. Imports dos seus novos componentes
import { ExperimentosComponent } from './app/pages/experimentos/experimentos.component'; // Listagem
import { CadastroExperimentoComponent } from './app/pages/cadastro-experimento/cadastro-experimento'; // Cadastro
import { ExperimentoDetalhesComponent } from './app/pages/experimento-detalhes/experimento-detalhes.component'; // Detalhes
import { CadastroParticipanteComponent } from './app/pages/cadastro-participante/cadastro-participante'; // Cadastro Participante
import { ExperimentoDashboardComponent } from './app/pages/experimento-dashboard/experimento-dashboard.component';
import { PerfilUsuarioComponent } from './app/pages/perfil-usuario/perfil-usuario.component';



export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard], // A ÁREA PROTEGIDA
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, 
            { path: 'participantes/novo', component: CadastroParticipanteComponent },
            { path: 'experimentos', component: ExperimentosComponent }, 
            { path: 'dashboard', component: Dashboard },
            { path: 'cadastro-experimento', component: CadastroExperimentoComponent },
            { path: 'experimentos/:id', component: ExperimentoDetalhesComponent },
            { path: 'experimentos/:id/dashboard', component: ExperimentoDashboardComponent },
            { path: 'perfil', component: PerfilUsuarioComponent }
        
        ]
    },
    // A ÁREA PÚBLICA DE AUTENTICAÇÃO
    { 
        path: 'auth', 
        loadChildren: () => import('./app/pages/auth/auth.routes') 
    },

    // Rota "catch-all"
    { path: '**', redirectTo: '/dashboard' }
];
