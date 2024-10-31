import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base/base.service';
import { Image } from '../data-contracts';
import { catchError, of, take, tap } from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class ImageService extends BaseService<Image> {
   private imageSignal = signal<Image[]>([]);
   public images = computed(() => this.imageSignal.asReadonly());

   images$ = signal<Image[]>([]);
   loading$ = signal<boolean>(false);
   error$ = signal<string | null>(null);

   constructor(http: HttpClient) {
      super(http);
      this.setPath('images');
   }

   /**
    * getImages: Fetches the list of images from the API
    *
    * @description Makes an HTTP GET request to retrieve all images
    * @remarks
    * - Sets loading state while request is in progress
    * - Updates images$ signal with response data on success
    * - Sets error$ signal with error message on failure
    * - Resets loading state when complete
    * @returns {void}
    */
   public getImages(): void {
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
               this.images$.set(data);
               this.loading$.set(false);
            })
         )
         .subscribe();
   }

   /**
    * saveImage: Saves an image to the API
    *
    * @param image The image object containing the data to save
    * @description Makes an HTTP POST request to save the image data
    * @returns {void}
    */
   public saveImage(image: Image): void {
      this.post(image)
         .pipe(
            take(1),
            tap(() => {
               this.getImages();
            })
         )
         .subscribe();
   }
}
