import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { provideAuth0 } from '@auth0/auth0-angular';

import { routes } from './app.routes';
import { TokenService } from './services';

/**
 * Function to retrieve the authentication token
 *
 * @description
 * Used by the JWT module to get the current authentication token
 * from the TokenService for authenticating API requests
 *
 * @returns The current JWT token string or null if not authenticated
 */
export function tokenGetter() {
   const tokenService = inject(TokenService);
   return tokenService.get();
}

/**
 * Application configuration object
 *
 * @description
 * Configures core Angular providers and services including:
 * - Routing
 * - HTTP client
 * - Auth0 authentication
 * - JWT token handling
 */
export const appConfig: ApplicationConfig = {
   providers: [
      provideRouter(routes),
      provideHttpClient(withInterceptorsFromDi()),
      provideAuth0({
         domain: 'dev-jasonhick.uk.auth0.com',
         clientId: 'T82hYUQ7BWynTQ7aZJ3fXtYlLDkL89N4',
         authorizationParams: {
            redirect_uri: window.location.origin + '/dashboard',
            audience: 'portfolio-admin',
            scope: 'openid profile email permissions'
         }
      }),
      importProvidersFrom(
         JwtModule.forRoot({
            config: {
               tokenGetter: tokenGetter,
               allowedDomains: ['localhost:5000', '127.0.0.1:5000'],
               disallowedRoutes: []
            }
         })
      )
   ]
};
