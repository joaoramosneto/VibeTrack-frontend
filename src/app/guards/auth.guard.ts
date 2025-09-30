import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../pages/service/auth.service'; // Ajuste o caminho se necessário

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // VAMOS ADICIONAR OS ESPIÕES AQUI
  console.log('%c--- AuthGuard ATIVADO! ---', 'color: red; font-weight: bold;');
  console.log('O usuário está tentando acessar a URL:', state.url);
  console.log('O usuário está logado?', authService.isLoggedIn());

  if (authService.isLoggedIn()) {
    console.log('Resultado: PERMITIDO (usuário está logado).');
    return true;
  }
  
  // A verificação que adicionamos
  if (state.url.startsWith('/auth/verificar')) {
      console.log('Resultado: PERMITIDO (é a página de verificação).');
      return true;
  }

  // Se chegou até aqui, vai bloquear
  console.log('Resultado: BLOQUEADO. Redirecionando para /auth/login...');
  router.navigate(['/auth/login']);
  return false;
};