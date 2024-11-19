import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
   selector: 'app-login-button',
   standalone: true,
   templateUrl: './login-button.html',
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginButtonComponent {
   public auth = inject(AuthService);
}
