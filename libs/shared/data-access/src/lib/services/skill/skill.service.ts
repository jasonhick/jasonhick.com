import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base/base.service';
import { Skill } from '../data-contracts';
import { catchError, of, take, tap, EMPTY } from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class SkillService extends BaseService<Skill> {
   private skillSignal = signal<Skill[]>([]);
   public skills = computed(() => this.skillSignal.asReadonly());

   skills$ = signal<Skill[]>([]);
   loading$ = signal<boolean>(false);
   error$ = signal<string | null>(null);

   constructor(http: HttpClient) {
      super(http);
      this.setPath('skills');
   }

   /**
    * getSkills: Fetches the list of skills from the API
    *
    * @description Makes an HTTP GET request to retrieve all skills
    * @remarks
    * - Sets loading state while request is in progress
    * - Updates skills$ signal with response data on success
    * - Sets error$ signal with error message on failure
    * - Resets loading state when complete
    * @returns {void}
    */
   public getSkills(): void {
      this.loading$.set(true);
      this.error$.set(null);

      this.list()
         .pipe(
            take(1),
            catchError((error) => {
               this.error$.set(error);
               this.loading$.set(false);
               return of([]);
            }),
            tap((data) => {
               this.skills$.set(data);
               this.loading$.set(false);
            })
         )
         .subscribe();
   }

   /**
    * saveSkill: Saves a skill to the API
    *
    * @param skill The skill object containing the data to save
    * @description Makes an HTTP POST request to save the skill data
    * @returns {void}
    */
   public saveSkill(skill: Skill): void {
      const currentSkills = this.skills$();

      // Optimistically update the UI
      if (skill.id) {
         // Update existing skill
         this.skills$.set(currentSkills.map((s) => (s.id === skill.id ? skill : s)));
      } else {
         // Add new skill
         this.skills$.set([...currentSkills, { ...skill, id: Date.now() }]);
      }

      this.post(skill)
         .pipe(
            take(1),
            catchError((error) => {
               // On error, revert to original state and refresh
               this.error$.set(error);
               this.getSkills();
               return EMPTY;
            })
         )
         .subscribe((savedSkill) => {
            // Update with the actual saved skill from the server
            this.skills$.set(
               skill.id
                  ? currentSkills.map((s) => (s.id === skill.id ? savedSkill : s))
                  : [...currentSkills, savedSkill]
            );
         });
   }
}
