import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { SkillsComponent } from './skills.component';

describe('SkillsComponent', () => {
   let component: SkillsComponent;
   let fixture: ComponentFixture<SkillsComponent>;
   let route: { firstChild: { snapshot: { paramMap: Map<string, string> } } };

   beforeEach(async () => {
      route = {
         firstChild: {
            snapshot: {
               paramMap: new Map().set('skillId', '123')
            }
         }
      };

      await TestBed.configureTestingModule({
         imports: [SkillsComponent],
         providers: [
            provideHttpClient(),
            {
               provide: ActivatedRoute,
               useValue: route
            }
         ]
      }).compileComponents();

      fixture = TestBed.createComponent(SkillsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });

   it('should have a skillId$ observable with ID when route param exists', () => {
      component.skillId$.subscribe((skillId) => {
         expect(skillId).toBe('123');
      });
   });

   it('should have a skillId$ observable with null when no route param exists', () => {
      route.firstChild.snapshot.paramMap = new Map();
      fixture.detectChanges();

      component.skillId$.subscribe((skillId) => {
         expect(skillId).toBeNull();
      });
   });
});
