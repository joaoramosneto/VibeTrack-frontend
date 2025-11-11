// Em: src/app/pages/auth/auth.routes.ts

import { Routes } from '@angular/router';

// Imports dos seus componentes
import { Login } from './login'; 
import { RegisterComponent } from './register.component';
import { VerificacaoComponent } from '../verificacao/verificacao.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component'; // <-- O import que faltava

export default [
    { path: 'login', component: Login },
    { path: 'register', component: RegisterComponent },
    { path: 'verificar', component: VerificacaoComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    
    // vvvv A LINHA QUE FALTAVA vvvv
    { path: 'reset-password', component: ResetPasswordComponent }
    // ^^^^ A LINHA QUE FALTAVA ^^^^

] satisfies Routes;