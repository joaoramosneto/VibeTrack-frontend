// Caminho: src/app/pages/auth/auth.routes.ts

import { Routes } from '@angular/router';

// 1. Importa os componentes com os nomes corretos do seu projeto
import { Login } from './login'; // O seu componente de login
import { RegisterComponent } from './register.component'; // O seu componente de registro
import { VerificacaoComponent } from '../verificacao/verificacao.component'; // O novo componente que criamos

export default [
    // 2. Aponta para os componentes corretos
    { path: 'login', component: Login },
    { path: 'register', component: RegisterComponent },
    { path: 'verificar', component: VerificacaoComponent }
] satisfies Routes;