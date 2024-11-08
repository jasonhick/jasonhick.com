import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
   selector: 'app-form-error',
   standalone: true,
   template: `
      @if (control?.errors && control?.touched) { @switch (true) { @case (control?.errors?.['required']) {
      <span class="error-message">{{ field }} is required</span>
      } @case (control?.errors?.['email']) {
      <span class="error-message">Please enter a valid email</span>
      } @case (control?.errors?.['minlength']) {
      <span class="error-message">
         {{ field }} must be at least {{ control?.errors?.['minlength']?.requiredLength }} characters
      </span>
      } } }
   `
})
export class FormErrorComponent {
   @Input() control: AbstractControl | FormControl | null = null;
   @Input() field = 'This field';
}
