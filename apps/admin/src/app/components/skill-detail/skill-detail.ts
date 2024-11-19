import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, computed, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SkillService } from '@jasonhick.com/data-access';
import { take, tap, map, switchMap, of } from 'rxjs';

import { FormErrorComponent } from '../form-error/form-error.component';
import { FormFieldComponent } from '../form-field/form-field.component';

/**
 * Component for managing individual skill details
 *
 * @description
 * Provides a form interface for:
 * - Creating new skills
 * - Editing existing skills
 * - Deleting skills
 *
 * @remarks
 * - Uses signals for reactive state management
 * - Automatically syncs form with selected skill
 * - Handles form validation
 * - Redirects to skills list after operations
 *
 * @example
 * <app-skill-detail></app-skill-detail>
 */
@Component({
   selector: 'app-skill-detail',
   standalone: true,
   imports: [CommonModule, ReactiveFormsModule, FormErrorComponent, FormFieldComponent],
   templateUrl: './skill-detail.html'
})
export class SkillDetailComponent implements OnInit {
   private fb = inject(FormBuilder);
   private route = inject(ActivatedRoute);
   private router = inject(Router);
   private skillService = inject(SkillService);

   public form!: FormGroup;

   /**
    * Signal tracking the currently selected skill
    *
    * @description
    * Converts route params stream into a signal that:
    * - Extracts skillId from route params
    * - Fetches skill details if ID exists
    * - Returns null for new skill creation
    *
    * @returns {Signal<Skill | null>} The currently selected skill or null
    */
   public selectedSkill = toSignal(
      this.route.params.pipe(
         map((params) => (params['skillId'] ? parseInt(params['skillId'], 10) : null)),
         switchMap((id) => (id ? this.skillService.getSkill(id) : of(null)))
      ),
      { initialValue: null }
   );

   /**
    * Computed signal for the submit button text
    *
    * @returns {Signal<string>} 'Update' when editing, 'Save' when creating
    */
   public buttonText = computed(() => (this.selectedSkill() ? 'Update' : 'Save'));

   /**
    * Sets up form synchronisation effect
    *
    * @description
    * Creates an effect that:
    * - Watches the selectedSkill signal
    * - Updates form values when skill changes
    * - Resets form when no skill is selected
    */
   constructor() {
      effect(() => {
         const skill = this.selectedSkill();
         if (skill) {
            this.form?.patchValue(skill);
         } else {
            this.form?.reset();
         }
      });
   }

   /**
    * Initialises the form on component initialisation
    */
   public ngOnInit(): void {
      this.initForm();
   }

   /**
    * Creates the form group with initial values
    *
    * @description
    * Sets up form controls:
    * - id: nullable field for existing skills
    * - name: required text field
    */
   private initForm(): void {
      this.form = this.fb.group({
         id: [null],
         name: ['', Validators.required]
      });
   }

   /**
    * Handles form submission for both create and update operations
    *
    * @description
    * - Validates form before submission
    * - Determines create/update based on ID presence
    * - Refreshes skills list after successful operation
    * - Redirects to skills list
    *
    * @throws Will not proceed if form is invalid
    */
   public saveSkill(): void {
      if (this.form.valid) {
         const { id, ...formData } = this.form.value;

         const save$ = !id
            ? this.skillService.createSkill(formData)
            : this.skillService.updateSkill({ id, ...formData });

         save$
            .pipe(
               take(1),
               tap(() => {
                  this.skillService.getSkills();
                  this.router.navigate(['../'], { relativeTo: this.route });
               })
            )
            .subscribe();
      }
   }

   /**
    * Deletes the current skill
    *
    * @description
    * - Retrieves skill ID from form
    * - Calls delete API if ID exists
    * - Refreshes skills list after successful deletion
    * - Redirects to skills list
    *
    * @remarks
    * Only enabled when editing an existing skill
    */
   public deleteSkill(): void {
      const id = this.form.get('id')?.value;

      if (id) {
         this.skillService
            .deleteSkill(id)
            .pipe(
               take(1),
               tap(() => {
                  this.skillService.getSkills();
                  this.router.navigate(['../'], { relativeTo: this.route });
               })
            )
            .subscribe();
      }
   }
}
