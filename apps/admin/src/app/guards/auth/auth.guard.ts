// Create new file: apps/admin/src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { tap } from 'rxjs/operators';
/**
 * Authentication guard for protecting routes
 *
 * @description
 * Route guard that checks if the user is authenticated before allowing access.
 * If not authenticated, redirects to the home page.
 *
 * @example
 * ```ts
 * const routes: Routes = [
 *   {
 *     path: 'protected',
 *     canActivate: [authGuard],
 *     component: ProtectedComponent
 *   }
 * ];
 * ```
 *
 * @returns An observable that resolves to true if authenticated, false otherwise
 */
export const authGuard = () => {
   const auth = inject(AuthService);
   const router = inject(Router);

   return auth.isAuthenticated$.pipe(
      tap((isAuthenticated) => {
         if (!isAuthenticated) {
            router.navigate(['']);
         }
      })
   );
};
