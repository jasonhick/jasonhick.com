import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Skill, SkillService } from '@jasonhick.com/data-access';
import { map, switchMap, tap, of, Observable, take } from 'rxjs';

import { FormErrorComponent } from '../form-error/form-error.component';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
   selector: 'app-skill-detail',
   standalone: true,
   imports: [CommonModule, ReactiveFormsModule, FormErrorComponent, FormFieldComponent],
   templateUrl: './skill-detail.component.html'
})
export class SkillDetailComponent implements OnInit {
   private fb = inject(FormBuilder);
   private route = inject(ActivatedRoute);
   private skillService = inject(SkillService);

   public buttonText = 'Save Skill';
   public skill$ = this.fetchSkill();
   public form!: FormGroup;

   /**
    * Initializes form after component is created
    * @see initForm
    */
   public ngOnInit(): void {
      this.initForm();
   }

   /**
    * Initializes the form with default values and validation rules
    */
   private initForm(): void {
      this.form = this.fb.group({
         id: [null],
         name: ['', Validators.required]
      });
   }

   /**
    * Fetches a skill based on the route parameter 'skillId'.
    * If skillId exists, retrieves the skill from the service.
    * Resets form and updates button text based on whether editing existing or creating new.
    *
    * @remarks
    * This method performs the following steps:
    * 1. Extracts and parses the skillId from route params
    * 2. Resets the form and sets default button text
    * 3. If skillId exists, fetches skill data from service
    * 4. Updates form with skill data if found
    *
    * @returns Observable that emits the fetched Skill or null if creating new
    * @see SkillService.getSkill
    */
   private fetchSkill(): Observable<Skill | null> {
      return this.route.params.pipe(
         map((params) => (params['skillId'] ? parseInt(params['skillId'], 10) : null)),
         tap(() => {
            this.form.reset();
            this.buttonText = 'Save Skill';
         }),
         switchMap((skillId) => {
            if (!skillId) return of(null);
            return this.skillService.getSkill(skillId);
         }),
         tap((skill) => {
            if (skill) {
               this.form.patchValue(skill);
               this.buttonText = 'Update Skill';
            }
         })
      );
   }

   /**
    * Saves or updates skill data based on form submission
    *
    * @remarks
    * This method performs the following:
    * 1. Checks if form is valid
    * 2. Extracts id and remaining form data
    * 3. If no id exists, creates new skill
    * 4. If id exists, updates existing skill
    *
    * @see SkillService.createSkill
    * @see SkillService.updateSkill
    */
   public saveSkill(): void {
      if (this.form.valid) {
         const { id, ...formData } = this.form.value;

         if (!id) {
            this.skillService.createSkill(formData).pipe(take(1)).subscribe();
         } else {
            this.skillService
               .updateSkill({ id, ...formData })
               .pipe(take(1))
               .subscribe();
         }

         this.fetchSkill().subscribe();
      }
   }
}
