import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Client } from '@jasonhick.com/data-access';

@Component({
   selector: 'app-client-list',
   standalone: true,
   imports: [CommonModule, RouterLink],
   templateUrl: './client-list.component.html'
})
export class ClientListComponent {
   @Input() clients: Client[] = [];

   constructor(private router: Router) {}
}
