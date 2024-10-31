import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base/base.service';
import { Project } from '../data-contracts';
import { catchError, of, take, tap } from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class ProjectService extends BaseService<Project> {
   private projectSignal = signal<Project[]>([]);
   public projects = computed(() => this.projectSignal.asReadonly());

   projects$ = signal<Project[]>([]);
   loading$ = signal<boolean>(false);
   error$ = signal<string | null>(null);

   constructor(http: HttpClient) {
      super(http);
      this.setPath('projects');
   }

   /**
    * getProjects: Fetches the list of projects from the API
    *
    * @description Makes an HTTP GET request to retrieve all projects
    * @remarks
    * - Sets loading state while request is in progress
    * - Updates projects$ signal with response data on success
    * - Sets error$ signal with error message on failure
    * - Resets loading state when complete
    * @returns {void}
    */
   public getProjects(): void {
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
               this.projects$.set(data);
               this.loading$.set(false);
            })
         )
         .subscribe();
   }

   /**
    * saveProject: Saves a project to the API
    *
    * @param project The project object containing the data to save
    * @description Makes an HTTP POST request to save the project data
    * @returns {void}
    */
   public saveProject(project: Project): void {
      this.post(project)
         .pipe(
            take(1),
            tap(() => {
               this.getProjects();
            })
         )
         .subscribe();
   }
}
