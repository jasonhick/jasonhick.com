import { Routes } from '@angular/router';

import * as COMPONENTS from './components';
import * as VIEWS from './views';

export const routes: Routes = [
   {
      path: 'clients',
      component: VIEWS.ClientsComponent,
      children: [
         {
            path: '',
            component: COMPONENTS.ClientListComponent,
            children: [
               {
                  path: ':clientId',
                  component: COMPONENTS.ClientDetailComponent
               }
            ]
         }
      ]
   },
   {
      path: 'projects',
      component: VIEWS.ProjectsComponent,
      children: [
         {
            path: '',
            component: COMPONENTS.ProjectListComponent,
            children: [
               {
                  path: ':projectId',
                  component: COMPONENTS.ProjectDetailComponent
               }
            ]
         }
      ]
   },
   {
      path: 'images',
      component: VIEWS.ImagesComponent,
      children: [
         {
            path: '',
            component: COMPONENTS.ImageListComponent,
            children: [
               {
                  path: ':imageId',
                  component: COMPONENTS.ImageDetailComponent
               }
            ]
         }
      ]
   },
   {
      path: 'skills',
      component: VIEWS.SkillsComponent,
      children: [
         {
            path: '',
            component: COMPONENTS.SkillListComponent,
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
