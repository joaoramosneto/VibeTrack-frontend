import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
// 1. Importe o novo componente aqui
import { CadastroExperimentoComponent } from './app/pages/cadastro-experimento/cadastro-experimento';
import { CadastroParticipanteComponent } from './app/pages/cadastro-participante/cadastro-participante';
import { authGuard } from '../src/app/guards/auth.guard';
import { ExperimentoDetalhesComponent } from './app/pages/experimento-detalhes/experimento-detalhes.component';


export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            // Redireciona a rota vazia para o dashboard
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, 
              { path: 'participantes/novo', component: CadastroParticipanteComponent },
            { path: 'dashboard', component: Dashboard },
            { path: 'cadastro-experimento', component: CadastroExperimentoComponent },
            { path: 'experimentos/:id', component: ExperimentoDetalhesComponent }
            // ... suas outras rotas internas
        ]
    },
    // A rota de autenticação já está correta, carregando as rotas de login
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },

    // Rotas de página cheia
    // { path: 'landing', component: Landing },
    // { path: 'notfound', component: Notfound },

    // Rota "catch-all" para qualquer outra URL
    { path: '**', redirectTo: '/dashboard' } // ou '/notfound'
];