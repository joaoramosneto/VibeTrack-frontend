// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../pages/service/auth.service';
 // Ajuste o caminho se necessário

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // Se o usuário está logado, permite o acesso
  } else {
    // Se não estiver logado, redireciona para a página de login
    router.navigate(['/auth/login']);
    return false; // Bloqueia o acesso à rota original
  }
};