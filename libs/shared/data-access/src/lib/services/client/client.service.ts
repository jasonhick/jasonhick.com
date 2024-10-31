import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base/base.service';
import { Client } from '../data-contracts';
import { catchError, of, take, tap } from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class ClientService extends BaseService<Client> {
   private clientSignal = signal<Client[]>([]);
   public clients = computed(() => this.clientSignal.asReadonly());

   clients$ = signal<Client[]>([]);
   loading$ = signal<boolean>(false);
   error$ = signal<string | null>(null);

   constructor(http: HttpClient) {
      super(http);
      this.setPath('clients');
   }

   /**
    * getClients: Fetches the list of clients from the API
    *
    * @description Makes an HTTP GET request to retrieve all clients
    * @remarks
    * - Sets loading state while request is in progress
    * - Updates clients$ signal with response data on success
    * - Sets error$ signal with error message on failure
    * - Resets loading state when complete
    * @returns {void}
    */
   public getClients(): void {
      this.loading$.set(true);
      this.error$.set(null);

      this.list()
         .pipe(
            take(1),
            catchError((error) => {
               this.error$.set(error);
               this.loading$.set(false);
               return of([]);
            }),
            tap((data) => {
               this.clients$.set(data);
               this.loading$.set(false);
            })
         )
         .subscribe();
   }

   /**
    * saveClient: Saves a client to the API
    *
    * @param client The client object containing the data to save
    * @description Makes an HTTP POST request to save the client data
    * @returns {void}
    */
   public saveClient(client: Client): void {
      this.post(client)
         .pipe(
            take(1),
            tap(() => {
               this.getClients();
            })
         )
         .subscribe();
   }
}
