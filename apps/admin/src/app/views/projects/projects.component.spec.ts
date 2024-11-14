import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ProjectsComponent } from './projects.component';

describe('ProjectsComponent', () => {
   let component: ProjectsComponent;
   let fixture: ComponentFixture<ProjectsComponent>;
   let route: { firstChild: { snapshot: { paramMap: Map<string, string> } } };

   beforeEach(async () => {
      route = {
         firstChild: {
            snapshot: {
               paramMap: new Map().set('projectId', '123')
            }
         }
      };

      await TestBed.configureTestingModule({
         imports: [ProjectsComponent],
         providers: [
            provideHttpClient(),
            {
               provide: ActivatedRoute,
               useValue: route
            }
         ]
      }).compileComponents();

      fixture = TestBed.createComponent(ProjectsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });

   it('should have a projectId$ observable with ID when route param exists', () => {
      component.projectId$.subscribe((projectId) => {
         expect(projectId).toBe('123');
      });
   });

   it('should have a projectId$ observable with null when no route param exists', () => {
      route.firstChild.snapshot.paramMap = new Map();
      fixture.detectChanges();

      component.projectId$.subscribe((projectId) => {
         expect(projectId).toBeNull();
      });
   });
});
