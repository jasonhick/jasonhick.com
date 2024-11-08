import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Client } from '@jasonhick.com/data-access';
import { FormErrorComponent } from '../form-error/form-error.component';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
   selector: 'app-client-detail',
   standalone: true,
   imports: [CommonModule, ReactiveFormsModule, FormErrorComponent, FormFieldComponent],
   templateUrl: './client-detail.component.html'
})
export class ClientDetailComponent {
   form: FormGroup;
   @Output() submitted = new EventEmitter<Client>();

   constructor(private fb: FormBuilder) {
      this.form = this.fb.group({
         name: ['', Validators.required],
         description: ['', Validators.required],
         website: [''],
         logo_url: [''],
         start_date: ['', Validators.required],
         end_date: ['', Validators.required]
      });
   }

   onSubmit(): void {
      if (this.form.valid) {
         const data: Client = this.form.value;

         // Convert dates to ISO format if they exist
         if (data.start_date) {
            data.start_date = new Date(data.start_date).toISOString();
         }

         if (data.end_date) {
            data.end_date = new Date(data.end_date).toISOString();
         }

         this.submitted.emit(data);
      }
   }
}
