import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Client } from '@jasonhick.com/data-access';

@Component({
   selector: 'app-client-list',
   standalone: true,
   imports: [CommonModule, RouterModule],
   templateUrl: './client-list.component.html'
})
export class ClientListComponent {
   @Input() clients: Client[] = [];
   public router = inject(Router);
}
