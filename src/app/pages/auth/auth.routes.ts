import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from './login';
import { Error } from './error';
// CORRECTION: Import the class named 'Register'
import { RegisterComponent } from './register.component'; 

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: Login },
    // Use the corrected component name here
    { path: 'register', component: RegisterComponent } 
] as Routes;