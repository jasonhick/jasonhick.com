import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';

import { ProjectListComponent } from '../../components';

@Component({
   selector: 'app-projects',
   standalone: true,
   imports: [AsyncPipe, ProjectListComponent, RouterOutlet],
   templateUrl: './projects.component.html'
})
export class ProjectsComponent {
   private route = inject(ActivatedRoute);
   private router = inject(Router);

   /*
    * Track the current project ID from the child route parameters
    * so we can conditionally render the project detail panel
    */
   projectId$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => this.route.firstChild?.snapshot.paramMap.get('projectId') ?? null)
   );
}
