import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';

import { SkillListComponent } from '../../components';

@Component({
   selector: 'app-skills',
   standalone: true,
   imports: [AsyncPipe, SkillListComponent, RouterOutlet],
   templateUrl: './skills.component.html'
})
export class SkillsComponent {
   private route = inject(ActivatedRoute);
   private router = inject(Router);

   /*
    * Track the current skill ID from the child route parameters
    * so we can conditionally render the skill detail panel
    */
   skillId$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => this.route.firstChild?.snapshot.paramMap.get('skillId') ?? null)
   );
}
