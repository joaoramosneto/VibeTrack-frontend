import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // RouterModule é necessário aqui
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button'; // Import para o pButton
import { AuthService } from './app/pages/service/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule // Adicionado para o <button pButton> funcionar
  ],
  template: `
    <div class="algum-lugar-no-seu-header-ou-menu">
      <button *ngIf="authService.isLoggedIn()" 
              (click)="logout()" 
              pButton type="button" 
              label="Sair" 
              icon="pi pi-sign-out" 
              styleClass="p-button-danger">
      </button>
    </div>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'vibetrack-frontend';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}