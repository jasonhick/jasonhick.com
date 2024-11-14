import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectService } from '@jasonhick.com/data-access';

@Component({
   selector: 'app-project-list',
   standalone: true,
   imports: [CommonModule, RouterModule],
   templateUrl: './project-list.component.html'
})
export class ProjectListComponent {
   private projectService = inject(ProjectService);

   public readonly projects$ = this.projectService.projects$;

   constructor() {
      this.projectService.getProjects();
   }
}
