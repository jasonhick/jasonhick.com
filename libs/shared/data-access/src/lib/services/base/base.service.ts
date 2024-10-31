import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class BaseService<T> {
  protected url: string;
  protected headers: HttpHeaders;

  constructor(protected http: HttpClient) {
    this.url = '';
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  /**
   * Sets the path for the API endpoint
   * @param path - The path to the API endpoint
   */
  protected setPath(path: string) {
    const base = 'http://localhost:5000/api';
    this.url = `${base}/${path}`;
  }

  /**
   * Retrieves a list of all items from the API endpoint
   * @returns An Observable that emits an array of items of type T
   */
  list(): Observable<T[]> {
    return this.http.get<T[]>(this.url, { headers: this.headers });
  }

  /**
   * Retrieves a single item from the API endpoint
   * @param id - The ID of the item to retrieve
   * @returns An Observable that emits an item of type T
   */
  get(id?: number): Observable<T> {
    return this.http.get<T>(`${this.url}/${id}`, { headers: this.headers });
  }

  /**
   * Creates a new item on the API endpoint
   * @param item - The item to create
   * @returns An Observable that emits the created item of type T
   */
  post(item: T): Observable<T> {
    return this.http.post<T>(this.url, item, { headers: this.headers });
  }

  /**
   * Updates an existing item on the API endpoint
   * @param id - The ID of the item to update
   * @param item - The item to update
   * @returns An Observable that emits the updated item of type T
   */
  put(id: number, item: T): Observable<T> {
    return this.http.put<T>(`${this.url}/${id}`, item, {
      headers: this.headers,
    });
  }

  /**
   * Deletes an item from the API endpoint
   * @param id - The ID of the item to delete
   * @returns An Observable that emits nothing
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`, {
      headers: this.headers,
    });
  }
}
