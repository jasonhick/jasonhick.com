import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
   selector: 'app-welcome-component',
   standalone: true,
   imports: [CommonModule],
   templateUrl: './welcome.html',
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeComponent {}
