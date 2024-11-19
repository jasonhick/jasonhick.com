import { Routes } from '@angular/router';

import * as COMPONENTS from './components';
import { authGuard } from './guards';
import * as VIEWS from './views';

export const routes: Routes = [
   {
      path: '',
      pathMatch: 'full',
      component: VIEWS.LoginComponent
   },
   {
      path: 'dashboard',
      component: VIEWS.DashboardComponent,
      canActivate: [authGuard],
      children: [
         {
            path: '',
            component: VIEWS.WelcomeComponent
         },
         {
            path: 'clients',
            component: VIEWS.ClientsComponent,
            children: [
               {
                  path: ':clientId',
                  component: COMPONENTS.ClientDetailComponent
               }
            ]
         },
         {
            path: 'projects',
            component: VIEWS.ProjectsComponent,
            children: [
               {
                  path: ':projectId',
                  component: COMPONENTS.ProjectDetailComponent
               }
            ]
         },
         {
            path: 'skills',
            component: VIEWS.SkillsComponent,
            children: [
               {
                  path: ':skillId',
                  component: COMPONENTS.SkillDetailComponent
               }
            ]
         }
      ]
   }
];
