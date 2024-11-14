import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class BaseService<T> {
   protected url: string;
   protected headers: HttpHeaders;
   protected http: HttpClient;

   constructor() {
      this.http = inject(HttpClient);
      this.url = '';
      this.headers = new HttpHeaders({
         'Content-Type': 'application/json'
      });
   }

   /**
    * Sets the path for the API endpoint
    * @param path - The path to the API endpoint
    */
   protected setPath(path: string) {
      const base = 'http://127.0.0.1:5000/api';
      this.url = `${base}/${path}`;
   }

   /**
    * Retrieves an item or a list of items
    * @param parentId - Optional parent ID to filter results
    * @returns An Observable that emits an array of items of type T
    */
   get(): Observable<T[]>;
   get(id: number): Observable<T>;
   get(id?: number): Observable<T[] | T> {
      const url = id ? `${this.url}/${id}` : this.url;
      return this.http.get<T[]>(url, { headers: this.headers });
   }

   /**
    * Creates a new item
    * @param item - The item to create
    * @returns An Observable that emits the created item of type T
    */
   post(item: T): Observable<T> {
      return this.http.post<T>(this.url, item, { headers: this.headers });
   }

   /**
    * Updates an existing item
    * @param id - The ID of the item to update
    * @param item - The item to update
    * @returns An Observable that emits the updated item of type T
    */
   put(id: number, item: T): Observable<T> {
      return this.http.put<T>(`${this.url}/${id}`, item, {
         headers: this.headers
      });
   }

   /**
    * Deletes an item
    * @param id - The ID of the item to delete
    * @returns An Observable that emits nothing
    */
   delete(id: number): Observable<void> {
      return this.http.delete<void>(`${this.url}/${id}`, {
         headers: this.headers
      });
   }
}
