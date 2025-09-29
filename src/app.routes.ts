import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { CadastroExperimentoComponent } from './app/pages/cadastro-experimento/cadastro-experimento';
import { CadastroParticipanteComponent } from './app/pages/cadastro-participante/cadastro-participante';
import { authGuard } from '../src/app/guards/auth.guard';
import { ExperimentoDetalhesComponent } from './app/pages/experimento-detalhes/experimento-detalhes.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard], // A ÁREA PROTEGIDA
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, 
            { path: 'participantes/novo', component: CadastroParticipanteComponent },
            { path: 'dashboard', component: Dashboard },
            { path: 'cadastro-experimento', component: CadastroExperimentoComponent },
            { path: 'experimentos/:id', component: ExperimentoDetalhesComponent }
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