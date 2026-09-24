import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;

  const reason = route.data['authReason'] ?? 'Please sign in to continue.';
  const fallback = route.data['authFallback'] ?? '/home';

  auth.openLogin(reason, () => router.navigateByUrl(state.url));
  return router.parseUrl(fallback);
};
