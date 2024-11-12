import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Image } from '@jasonhick.com/data-access';

@Component({
   selector: 'app-image-list',
   standalone: true,
   imports: [CommonModule, RouterLink],
   templateUrl: './image-list.component.html'
})
export class ImageListComponent {
   @Input() images: Image[] = [];
}
