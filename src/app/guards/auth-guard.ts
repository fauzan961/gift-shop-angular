import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

/**
 * Buying requires an account. Rather than bouncing to a login page, send the
 * visitor back to the cart and open the modal there — the same flow they get
 * from the "Proceed to Checkout" button, so a deep link behaves identically.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;

  auth.openLogin('Please sign in to complete your order.', () =>
    router.navigateByUrl(state.url)
  );
  return router.parseUrl('/cart');
};
