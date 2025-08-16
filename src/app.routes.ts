import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
// 1. Importe o novo componente aqui
import { CadastroExperimentoComponent } from './app/pages/cadastro-experimento/cadastro-experimento';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            // Redireciona a rota vazia para o dashboard
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, 
            { path: 'dashboard', component: Dashboard },
            { path: 'cadastro-experimento', component: CadastroExperimentoComponent },
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