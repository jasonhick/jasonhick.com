import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, Observable, of, take, tap } from 'rxjs';

import { BaseService } from '../base/base.service';
import { Client } from '../data-contracts';

export type ClientCreate = Omit<Client, 'id'>;
export type ClientUpdate = Required<Pick<Client, 'id'>> & Omit<Client, 'id'>;

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
    * Saves a client by creating a new one
    * @param client - The client object to save
    * @returns An Observable that emits the saved client and triggers a refresh of the clients list
    */
   public saveClient(client: ClientCreate): Observable<Client> {
      return this.post(client).pipe(
         take(1),
         tap(() => this.getClients())
      );
   }

   /**
    * Updates an existing client
    * @param client - The client object to update, containing id and updated fields
    * @returns An Observable that emits the updated client and triggers a refresh of the clients list
    */
   public updateClient(client: ClientUpdate): Observable<Client> {
      return this.put(client.id, client).pipe(
         take(1),
         tap(() => this.getClients())
      );
   }
}
