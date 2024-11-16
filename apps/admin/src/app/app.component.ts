import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
   standalone: true,
   imports: [RouterModule, CommonModule],
   selector: 'app-root',
   templateUrl: './app.component.html'
})
export class AppComponent {
   isMenuOpen = false;

   navItems = [
      { route: '/clients', label: 'Clients' },
      { route: '/projects', label: 'Projects' },
      { route: '/skills', label: 'Skills' }
      // { route: '/images', label: 'Images' }
   ];
}
