import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Skill } from '@jasonhick.com/data-access';

@Component({
   selector: 'app-skill-detail',
   standalone: true,
   imports: [CommonModule, ReactiveFormsModule],
   templateUrl: './skill-detail.component.html'
})
export class SkillDetailComponent {
   form: FormGroup;
   @Output() submitted = new EventEmitter<Skill>();

   constructor(private fb: FormBuilder) {
      this.form = this.fb.group({
         name: ['', Validators.required]
      });
   }

   onSubmit(): void {
      if (this.form.valid) {
         const data: Skill = this.form.value;
         this.submitted.emit(data);
      }
   }
}
