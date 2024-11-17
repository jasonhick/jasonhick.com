import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';

import { BaseService } from '../base/base.service';
import { Skill } from '../data-contracts';

export type SkillCreate = Omit<Skill, 'id'>;
export type SkillUpdate = Skill & { id: number };

@Injectable({
   providedIn: 'root'
})
export class SkillService extends BaseService<Skill> {
   public skills$ = signal<Skill[]>([]);
   public error$ = signal<string | null>(null);
   public loading$ = signal<boolean>(false);

   constructor() {
      super();
      this.setPath('skills');
   }

   /**
    * Fetches all skills from the API
    */
   public getSkills(): void {
      this.loading$.set(true);
      this.error$.set(null);

      this.get()
         .pipe(
            tap((skills) => {
               this.skills$.set(skills);
               this.loading$.set(false);
            }),
            catchError(this.handleError.bind(this))
         )
         .subscribe();
   }

   /**
    * Fetches a single skill by ID
    * @param id - The ID of the skill to fetch
    */
   public getSkill(id: number): Observable<Skill> {
      return this.get(id).pipe(catchError(this.handleError.bind(this)));
   }

   /**
    * Creates a new skill
    * @param skill - The skill data to create
    */
   public createSkill(skill: SkillCreate): Observable<Skill> {
      return this.post(skill).pipe(
         tap((newSkill) => {
            this.skills$.update((skills) => [...skills, newSkill]);
         }),
         catchError(this.handleError.bind(this))
      );
   }

   /**
    * Updates an existing skill
    * @param skill - The skill data to update
    */
   public updateSkill(skill: SkillUpdate): Observable<Skill> {
      return this.put(skill.id, skill).pipe(
         tap((updatedSkill) => {
            this.skills$.update((skills) => skills.map((s) => (s.id === updatedSkill.id ? updatedSkill : s)));
         }),
         catchError(this.handleError.bind(this))
      );
   }

   /**
    * Deletes a skill
    * @param id - The ID of the skill to delete
    */
   public deleteSkill(id: number): Observable<void> {
      return this.delete(id).pipe(
         tap(() => {
            this.skills$.update((skills) => skills.filter((s) => s.id !== id));
         }),
         catchError(this.handleError.bind(this))
      );
   }

   /**
    * Handles HTTP errors
    * @param error - The error to handle
    */
   private handleError(error: HttpErrorResponse) {
      this.error$.set(error.message || 'An error occurred');
      this.loading$.set(false);
      return throwError(() => error);
   }
}
