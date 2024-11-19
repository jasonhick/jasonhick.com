import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAuth0 } from '@auth0/auth0-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
   providers: [
      provideRouter(routes),
      provideHttpClient(withFetch()),
      provideAuth0({
         domain: 'dev-jasonhick.uk.auth0.com',
         clientId: 'T82hYUQ7BWynTQ7aZJ3fXtYlLDkL89N4',
         authorizationParams: {
            redirect_uri: window.location.origin + '/dashboard'
         }
      })
   ]
};
