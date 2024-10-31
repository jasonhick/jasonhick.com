import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Image, ImageService } from '@jasonhick.com/data-access';
import * as COMPONENTS from '../../components';

@Component({
   selector: 'app-images',
   standalone: true,
   imports: [CommonModule, COMPONENTS.ImageListComponent, COMPONENTS.ImageDetailComponent, RouterOutlet],
   providers: [ImageService],
   templateUrl: './images.component.html'
})
export class ImagesComponent implements OnInit {
   images$ = signal<Image[]>([]);
   loading$ = signal<boolean>(false);
   error$ = signal<string | null>(null);

   constructor(private imageService: ImageService) {
      this.images$ = this.imageService.images$;
      this.loading$ = this.imageService.loading$;
      this.error$ = this.imageService.error$;
   }

   ngOnInit(): void {
      this.imageService.getImages();
   }

   saveImage(image: Image): void {
      this.imageService.saveImage(image);
   }
}
