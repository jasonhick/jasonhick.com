import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, Observable, of, take, tap } from 'rxjs';

import { BaseService } from '../base/base.service';
import { Client } from '../data-contracts';

export type ClientCreate = Omit<Client, 'id'>;
export type ClientUpdate = Partial<Client>;

@Injectable({
   providedIn: 'root'
})
export class ClientService extends BaseService<Client> {
   public readonly clients$ = signal<Client[]>([]);
   public readonly error$ = signal<string | null>(null);
   public readonly loading$ = signal<boolean>(false);

   constructor(http: HttpClient) {
      super(http);
      this.setPath('clients');
   }

   /**
    * Retrieves all clients from the API and updates the clients$ signal
    * This method:
    * 1. Sets loading state to true and clears any previous errors
    * 2. Makes HTTP GET request to fetch clients
    * 3. Updates the clients$ signal with the response data
    * 4. Handles any errors by setting error state
    * 5. Sets loading state to false when complete
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
    * Retrieves a single client by ID
    * @param id - The ID of the client to retrieve
    * @returns An Observable that emits either:
    * - A Client object if found
    * - An empty array if there's an error or client not found
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
    * Saves a client by either creating a new one or updating an existing one
    * @param client - The client object to save
    * @returns An Observable that emits the saved client and triggers a refresh of the clients list
    */
   public saveClient(client: ClientCreate): Observable<Client> {
      return this.post(client).pipe(
         take(1),
         tap(() => this.getClients())
      );
   }
}
