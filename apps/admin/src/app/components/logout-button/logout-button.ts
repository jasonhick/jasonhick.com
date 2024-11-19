import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
   selector: 'app-logout-button',
   standalone: true,
   imports: [CommonModule],
   templateUrl: './logout-button.html',
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoutButtonComponent {
   public auth = inject(AuthService);
   public document = inject(DOCUMENT);
}
