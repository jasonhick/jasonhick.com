import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';

import { ClientListComponent } from '../../components/client-list/client-list.component';

@Component({
   selector: 'app-clients',
   standalone: true,
   imports: [ClientListComponent, RouterOutlet, AsyncPipe],
   templateUrl: './clients.component.html'
})
export class ClientsComponent {
   private route = inject(ActivatedRoute);
   private router = inject(Router);

   /*
    * Track the current client ID from the child route parameters
    * so we can conditionally render the client detail panel
    */
   clientId$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => this.route.firstChild?.snapshot.paramMap.get('clientId') ?? null)
   );
}
