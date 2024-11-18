import { Injectable, signal } from '@angular/core';
import { catchError, Observable, of, take, tap } from 'rxjs';

import { BaseService } from '../base/base.service';
import { Project, ProjectCreate, ProjectUpdate } from '../data-contracts';

@Injectable({
   providedIn: 'root'
})
export class ProjectService extends BaseService<Project> {
   public readonly projects$ = signal<Project[]>([]);
   public readonly error$ = signal<string | null>(null);
   public readonly loading$ = signal<boolean>(false);

   constructor() {
      super();
      this.setPath('projects');
   }

   /**
    * Retrieves all projects from the API
    *
    * @remarks
    * This method:
    * 1. Clears any existing error state
    * 2. Sets loading state to true
    * 3. Fetches projects from the API
    * 4. Updates the projects$ signal with the response
    * 5. Handles errors by setting error$ signal
    *
    * @see Project
    * @see BaseService.get
    */
   public getProjects(): void {
      this.error$.set(null);
      this.loading$.set(true);

      this.get()
         .pipe(
            take(1),
            catchError((error) => {
               this.error$.set(error);
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
    * Fetches a single project by its ID
    *
    * @param id - The unique identifier of the project
    * @returns Observable<Project | null>
    *
    * @remarks
    * Returns null if project is not found or if an error occurs
    * Updates loading$ and error$ signals during operation
    *
    * @see Project
    * @see BaseService.get
    */
   public getProject(id: number): Observable<Project | null> {
      this.error$.set(null);
      this.loading$.set(true);

      return this.get(id).pipe(
         take(1),
         catchError((error) => {
            this.error$.set(error);
            this.loading$.set(false);
            return of(null);
         }),
         tap(() => this.loading$.set(false))
      );
   }

   /**
    * Creates a new project
    *
    * @param project - The project data to create
    * @returns Observable<Project>
    *
    * @remarks
    * After successful creation, refreshes the projects list
    *
    * @see ProjectCreate
    * @see BaseService.post
    */
   public saveProject(project: ProjectCreate): Observable<Project> {
      this.error$.set(null);
      this.loading$.set(true);

      return this.post(project).pipe(
         take(1),
         catchError((error) => {
            this.error$.set(error);
            this.loading$.set(false);
            throw error;
         }),
         tap(() => {
            this.loading$.set(false);
            this.getProjects();
         })
      );
   }

   /**
    * Updates an existing project
    *
    * @param project - The project data to update
    * @returns Observable<Project>
    *
    * @remarks
    * After successful update, refreshes the projects list
    * Requires project.id to be present
    *
    * @see ProjectUpdate
    * @see BaseService.put
    */
   public updateProject(project: ProjectUpdate): Observable<Project> {
      this.error$.set(null);
      this.loading$.set(true);

      return this.put(project.id, project).pipe(
         take(1),
         catchError((error) => {
            this.error$.set(error);
            this.loading$.set(false);
            throw error;
         }),
         tap(() => {
            this.loading$.set(false);
            this.getProjects();
         })
      );
   }

   /**
    * Deletes a project by ID
    *
    * @param id - The unique identifier of the project to delete
    * @returns Observable<void>
    *
    * @remarks
    * After successful deletion, refreshes the projects list
    *
    * @see BaseService.delete
    */
   public deleteProject(id: number): Observable<void> {
      this.error$.set(null);
      this.loading$.set(true);

      return this.delete(id).pipe(
         take(1),
         catchError((error) => {
            this.error$.set(error);
            this.loading$.set(false);
            throw error;
         }),
         tap(() => {
            this.loading$.set(false);
            this.getProjects();
         })
      );
   }
}
