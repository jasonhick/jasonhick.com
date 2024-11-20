import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

import { LogoutButtonComponent } from '../../components';

@Component({
   selector: 'app-dashboard',
   standalone: true,
   imports: [CommonModule, RouterModule, LogoutButtonComponent],
   templateUrl: './dashboard.html',
   encapsulation: ViewEncapsulation.None,
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
   public auth = inject(AuthService);
   public isMenuOpen = false;
   public isUserMenuOpen = false;
   public permissions: string[] = [];
   public navItems = [
      { route: 'clients', label: 'Clients' },
      { route: 'projects', label: 'Projects' },
      { route: 'skills', label: 'Skills' }
      // { route: '/images', label: 'Images' }
   ];
}
