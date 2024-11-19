import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginButtonComponent, LogoutButtonComponent } from './components';

@Component({
   standalone: true,
   imports: [RouterModule, LoginButtonComponent, LogoutButtonComponent],
   selector: 'app-root',
   templateUrl: './app.component.html'
})
export class AppComponent {}
