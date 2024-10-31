import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Project } from '@jasonhick.com/data-access';

@Component({
   selector: 'app-project-detail',
   standalone: true,
   imports: [CommonModule, ReactiveFormsModule],
   templateUrl: './project-detail.component.html'
})
export class ProjectDetailComponent {
   form: FormGroup;
   @Output() submitted = new EventEmitter<Project>();

   constructor(private fb: FormBuilder) {
      this.form = this.fb.group({
         title: ['', Validators.required],
         description: ['', Validators.required],
         features: [[]],
         thumbnail_url: ['', Validators.required],
         live_url: [''],
         github_url: [''],
         start_date: ['', Validators.required],
         end_date: ['', Validators.required],
         is_featured: [false],
         client_id: [null]
      });
   }

   /**
    * Handles form submission.
    * Validates the form and emits the project data if valid.
    * Converts start and end dates to ISO format before emitting.
    */
   onSubmit(): void {
      if (this.form.valid) {
         const data: Project = this.form.value;

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
