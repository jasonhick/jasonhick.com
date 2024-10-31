import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { Project, ProjectService } from '@jasonhick.com/data-access';

import * as COMPONENTS from '../../components';

@Component({
   selector: 'app-projects',
   standalone: true,
   imports: [CommonModule, COMPONENTS.ProjectListComponent, COMPONENTS.ProjectDetailComponent, RouterOutlet],
   providers: [ProjectService],
   templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit {
   projects$ = signal<Project[]>([]);
   loading$ = signal<boolean>(false);
   error$ = signal<string | null>(null);

   constructor(private projectService: ProjectService) {
      this.projects$ = this.projectService.projects$;
      this.loading$ = this.projectService.loading$;
      this.error$ = this.projectService.error$;
   }

   /**
    * Lifecycle hook that is called when the component is initialized.
    */
   ngOnInit(): void {
      this.projectService.getProjects();
   }

   /**
    * Saves a project.
    * @param project - The project to save.
    */
   saveProject(project: Project): void {
      this.projectService.saveProject(project);
   }
}
