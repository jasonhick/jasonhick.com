import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Image } from '@jasonhick.com/data-access';

@Component({
   selector: 'app-image-detail',
   standalone: true,
   imports: [CommonModule, ReactiveFormsModule],
   templateUrl: './image-detail.component.html'
})
export class ImageDetailComponent {
   form: FormGroup;
   @Output() submitted = new EventEmitter<Image>();

   constructor(private fb: FormBuilder) {
      this.form = this.fb.group({
         url: ['', Validators.required],
         caption: [''],
         order: [0],
         project_id: [null, Validators.required]
      });
   }

   onSubmit(): void {
      if (this.form.valid) {
         const data: Image = this.form.value;
         this.submitted.emit(data);
      }
   }
}
