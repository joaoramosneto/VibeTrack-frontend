import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { authGuard } from './app/guards/auth.guard'; // Ajustei o caminho aqui tb

// Imports dos componentes
import { ExperimentosComponent } from './app/pages/experimentos/experimentos.component';
import { CadastroExperimentoComponent } from './app/pages/cadastro-experimento/cadastro-experimento';
import { ExperimentoDetalhesComponent } from './app/pages/experimento-detalhes/experimento-detalhes.component';
import { CadastroParticipanteComponent } from './app/pages/cadastro-participante/cadastro-participante';
import { ExperimentoDashboardComponent } from './app/pages/experimento-dashboard/experimento-dashboard.component';
import { PerfilUsuarioComponent } from './app/pages/perfil-usuario/perfil-usuario.component';
import { ParticipanteComponent } from './app/pages/participantes/participantes.component'; // <--- O ERRO ESTAVA AQUI
import { PesquisadoresComponent } from './app/pages/pesquisadores/pesquisadores.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            // Redireciona o caminho vazio para 'home'
            { path: '', redirectTo: 'home', pathMatch: 'full' }, 
            
            { path: 'home', component: Dashboard },
            
            { path: 'experimentos', component: ExperimentosComponent }, 
            { path: 'cadastro-experimento', component: CadastroExperimentoComponent },
            { path: 'experimentos/:id', component: ExperimentoDetalhesComponent },
            { path: 'experimentos/:id/dashboard', component: ExperimentoDashboardComponent },
            
            { path: 'participantes', component: ParticipanteComponent },
            { path: 'participantes/novo', component: CadastroParticipanteComponent },
            
            { path: 'perfil', component: PerfilUsuarioComponent },

            // Rota de Pesquisadores
            { path: 'pesquisadores', component: PesquisadoresComponent },
        ]
    },
    // Rota pública de autenticação
    { 
        path: 'auth', 
        loadChildren: () => import('./app/pages/auth/auth.routes') 
    },

    // Rota "Coringa"
    { path: '**', redirectTo: '/home' }
];