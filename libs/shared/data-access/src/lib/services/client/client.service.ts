import { Injectable, signal } from '@angular/core';
import { catchError, Observable, of, take, tap } from 'rxjs';

import { BaseService } from '../base/base.service';
import { Client, ClientCreate, ClientUpdate } from '../data-contracts';

@Injectable({
   providedIn: 'root'
})
export class ClientService extends BaseService<Client> {
   public readonly clients$ = signal<Client[]>([]);
   public readonly error$ = signal<string | null>(null);
   public readonly loading$ = signal<boolean>(false);

   constructor() {
      super();
      this.setPath('clients');
   }

   /**
    * Retrieves all clients from the API
    *
    * @remarks
    * This method:
    * 1. Clears any existing error state
    * 2. Sets loading state to true
    * 3. Fetches clients from the API
    * 4. Updates the clients$ signal with the response
    * 5. Handles errors by setting error$ signal
    *
    * @see Client
    * @see BaseService.get
    */
   public getClients(): void {
      this.error$.set(null);
      this.loading$.set(true);

      this.get()
         .pipe(
            take(1),
            catchError((error) => {
               this.error$.set(error);
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
    * Fetches a single client by their ID
    *
    * @param id - The unique identifier of the client
    * @returns Observable<Client | null>
    *
    * @remarks
    * Returns null if client is not found or if an error occurs
    * Updates loading$ and error$ signals during operation
    *
    * @see Client
    * @see BaseService.get
    */
   public getClient(id: number): Observable<Client | null> {
      this.error$.set(null);
      this.loading$.set(true);

      return this.get(id).pipe(
         take(1),
         catchError((error) => {
            this.error$.set(error);
            this.loading$.set(false);
            return of(null);
         }),
         tap(() => this.loading$.set(false))
      );
   }

   /**
    * Creates a new client
    *
    * @param client - The client data to create
    * @returns Observable<Client>
    *
    * @remarks
    * After successful creation, refreshes the clients list
    *
    * @see ClientCreate
    * @see BaseService.post
    */
   public saveClient(client: ClientCreate): Observable<Client> {
      this.error$.set(null);
      this.loading$.set(true);

      return this.post(client).pipe(
         take(1),
         catchError((error) => {
            this.error$.set(error);
            this.loading$.set(false);
            throw error;
         }),
         tap(() => {
            this.loading$.set(false);
            this.getClients();
         })
      );
   }

   /**
    * Updates an existing client
    *
    * @param client - The client data to update
    * @returns Observable<Client>
    *
    * @remarks
    * After successful update, refreshes the clients list
    * Requires client.id to be present
    *
    * @see ClientUpdate
    * @see BaseService.put
    */
   public updateClient(client: ClientUpdate): Observable<Client> {
      this.error$.set(null);
      this.loading$.set(true);

      return this.put(client.id, client).pipe(
         take(1),
         catchError((error) => {
            this.error$.set(error);
            this.loading$.set(false);
            throw error;
         }),
         tap(() => {
            this.loading$.set(false);
            this.getClients();
         })
      );
   }
}
