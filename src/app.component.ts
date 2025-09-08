import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // RouterModule é necessário aqui
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button'; // Import para o pButton
import { AuthService } from './app/pages/service/auth.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    ToastModule
  ],
  // CORREÇÃO: Adicione o <router-outlet> ao template
  template: `<router-outlet></router-outlet>` 
})
export class AppComponent {
  title = 'vibetrack-frontend';

  constructor() {}
}