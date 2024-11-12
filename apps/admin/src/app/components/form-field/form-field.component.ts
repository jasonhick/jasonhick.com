import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FormErrorComponent } from '../form-error/form-error.component';

@Component({
   selector: 'app-form-field',
   standalone: true,
   imports: [ReactiveFormsModule, FormErrorComponent],
   template: `
      <div>
         <label [for]="id" [class.required]="required">{{ label }}</label>
         <ng-content></ng-content>
         <app-form-error [control]="form.get(id)" [field]="label"></app-form-error>
      </div>
   `
})
export class FormFieldComponent {
   @Input({ required: true }) id!: string;
   @Input({ required: true }) label!: string;
   @Input({ required: true }) form!: FormGroup;
   @Input() required = false;
}
