import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TokenService } from '../../services/token-service/token-service';

@Component({
   selector: 'app-welcome-component',
   standalone: true,
   imports: [CommonModule],
   templateUrl: './welcome.html',
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeComponent {
   private tokenService = inject(TokenService);

   public readonly isLoading = this.tokenService.isLoading;
   public readonly error = this.tokenService.error;
   public readonly permissions = this.tokenService.permissions;
}
