import { Component } from '@angular/core';

import { LoginButtonComponent } from '../../components';

@Component({
   selector: 'app-login',
   standalone: true,
   imports: [LoginButtonComponent],
   template: `
      <div class="container mx-auto">
         <div class="h-[66vh] flex flex-col items-center justify-center space-y-6">
            <h1 class="text-5xl text-center font-bold text-blue-900">Portfolio Admin</h1>
            <p class="text-blue-900">Please login to continue</p>
            <app-login-button></app-login-button>
         </div>
      </div>
   `
})
export class LoginComponent {}
