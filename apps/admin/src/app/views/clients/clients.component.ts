import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Client, ClientService } from '@jasonhick.com/data-access';
import { ClientListComponent } from '../../components/client-list/client-list.component';
import { ClientDetailComponent } from '../../components/client-detail/client-detail.component';
import { RouterOutlet } from '@angular/router';

@Component({
   selector: 'app-clients',
   standalone: true,
   imports: [CommonModule, ClientListComponent, ClientDetailComponent, RouterOutlet],
   providers: [ClientService],
   templateUrl: './clients.component.html'
})
export class ClientsComponent implements OnInit {
   public clients$ = signal<Client[]>([]);
   public loading$ = signal<boolean>(false);
   public error$ = signal<string | null>(null);

   private clientService = inject(ClientService);

   constructor() {
      // Expose service signals to the template
      this.clients$ = this.clientService.clients$;
      this.loading$ = this.clientService.loading$;
      this.error$ = this.clientService.error$;
   }

   /**
    * Lifecycle hook that is called when the component is initialized
    *
    * @description Fetches the list of clients from the API
    */
   ngOnInit(): void {
      this.clientService.getClients();
   }

   /**
    * Saves a client to the API
    *
    * @param client The client object containing the data to save
    * @description Delegates to the client service to save the client data and refresh the client list
    */
   saveClient(client: Client): void {
      this.clientService.saveClient(client);
   }
}
