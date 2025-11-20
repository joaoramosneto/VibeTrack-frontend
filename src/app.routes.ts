import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { authGuard } from '../src/app/guards/auth.guard'; // (Este caminho ainda parece estranho, mas vamos manter)

// Imports
import { AnaliseBpmComponent } from './app/pages/analise-bpm/analise-bpm.component';
import { ExperimentosComponent } from './app/pages/experimentos/experimentos.component'; 
import { CadastroExperimentoComponent } from './app/pages/cadastro-experimento/cadastro-experimento'; 
import { ExperimentoDetalhesComponent } from './app/pages/experimento-detalhes/experimento-detalhes.component'; 
import { CadastroParticipanteComponent } from './app/pages/cadastro-participante/cadastro-participante'; 
import { ExperimentoDashboardComponent } from './app/pages/experimento-dashboard/experimento-dashboard.component';
import { PerfilUsuarioComponent } from './app/pages/perfil-usuario/perfil-usuario.component';
import { ParticipanteComponent } from './app/pages/participantes/participantes.component';


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
            { path: 'perfil', component: PerfilUsuarioComponent },
            { path: 'participantes', component: ParticipanteComponent },
            { path: 'analise-bpm', component: AnaliseBpmComponent } // A rota que você já adicionou
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