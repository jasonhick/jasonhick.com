import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClientService } from '@jasonhick.com/data-access';

@Component({
   selector: 'app-client-list',
   standalone: true,
   imports: [CommonModule, RouterModule],
   templateUrl: './client-list.component.html'
})
export class ClientListComponent {
   private clientService = inject(ClientService);

   public readonly clients$ = this.clientService.clients$;

   constructor() {
      this.clientService.getClients();
   }
}
