import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {  RouterOutlet } from '@angular/router';
import {  ClientService } from '@jasonhick.com/data-access';

import { ClientDetailComponent } from '../../components/client-detail/client-detail.component';
import { ClientListComponent } from '../../components/client-list/client-list.component';


@Component({
   selector: 'app-clients',
   standalone: true,
   imports: [CommonModule, ClientListComponent, ClientDetailComponent, RouterOutlet],
   providers: [ClientService],
   templateUrl: './clients.component.html'
})
export class ClientsComponent  {
   private clientService = inject(ClientService);
   
   public clients$ = this.clientService.clients$;
   public error$ = this.clientService.error$;

   ngOnInit(): void {
      this.clientService.getClients();
   }

}
