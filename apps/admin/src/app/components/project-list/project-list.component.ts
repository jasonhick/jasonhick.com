import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Project } from '@jasonhick.com/data-access';

@Component({
   selector: 'app-project-list',
   standalone: true,
   imports: [CommonModule, RouterLink],
   templateUrl: './project-list.component.html'
})
export class ProjectListComponent {
   @Input() projects: Project[] = [];
}
