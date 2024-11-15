import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SkillService } from '@jasonhick.com/data-access';
import { Subject, of } from 'rxjs';

import { SkillDetailComponent } from './skill-detail';

describe('SkillDetailComponent', () => {
   let component: SkillDetailComponent;
   let fixture: ComponentFixture<SkillDetailComponent>;
   let skillService: jest.Mocked<SkillService>;
   let router: jest.Mocked<Router>;
   let params$: Subject<{ skillId?: string }>;

   const mockSkill = {
      id: 1,
      name: 'Test Skill'
   };

   let getControl: (name: string) => AbstractControl;

   beforeEach(async () => {
      params$ = new Subject();

      skillService = {
         getSkill: jest.fn().mockReturnValue(of(mockSkill)),
         createSkill: jest.fn().mockReturnValue(of({})),
         updateSkill: jest.fn().mockReturnValue(of({})),
         deleteSkill: jest.fn().mockReturnValue(of({})),
         getSkills: jest.fn()
      } as unknown as jest.Mocked<SkillService>;

      router = {
         navigate: jest.fn()
      } as unknown as jest.Mocked<Router>;

      await TestBed.configureTestingModule({
         imports: [ReactiveFormsModule, SkillDetailComponent],
         providers: [
            FormBuilder,
            { provide: ActivatedRoute, useValue: { params: params$ } },
            { provide: Router, useValue: router },
            { provide: SkillService, useValue: skillService }
         ]
      }).compileComponents();

      fixture = TestBed.createComponent(SkillDetailComponent);
      component = fixture.componentInstance;

      getControl = (name: string): AbstractControl => {
         const control = component.form.get(name);
         if (!control) throw new Error(`Form control ${name} not found`);
         return control;
      };

      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });

   describe('Form Initialization', () => {
      it('should initialize form with empty values', () => {
         expect(getControl('id').value).toBeNull();
         expect(getControl('name').value).toBe(null);
      });

      it('should require name field', () => {
         const nameControl = getControl('name');
         expect(nameControl.hasValidator(Validators.required)).toBeTruthy();
         expect(nameControl.valid).toBeFalsy();
      });
   });

   describe('Selected Skill Signal', () => {
      it('should load skill when ID is in route params', () => {
         params$.next({ skillId: '1' });
         fixture.detectChanges();

         expect(skillService.getSkill).toHaveBeenCalledWith(1);
         expect(component.selectedSkill()).toEqual(mockSkill);
      });

      it('should update form when skill is loaded', () => {
         params$.next({ skillId: '1' });
         fixture.detectChanges();

         expect(getControl('id').value).toBe(mockSkill.id);
         expect(getControl('name').value).toBe(mockSkill.name);
      });
   });

   describe('Button Text', () => {
      it('should show "Update" when editing existing skill', () => {
         params$.next({ skillId: '1' });
         expect(component.buttonText()).toBe('Update');
      });

      it('should show "Save" when creating new skill', () => {
         params$.next({});
         expect(component.buttonText()).toBe('Save');
      });
   });

   describe('Save Skill', () => {
      it('should create new skill when no ID present', () => {
         component.form.patchValue({ id: null, name: 'New Skill' });
         component.saveSkill();

         expect(skillService.createSkill).toHaveBeenCalledWith({ name: 'New Skill' });
         expect(router.navigate).toHaveBeenCalledWith(['/skills']);
      });

      it('should update existing skill when ID present', () => {
         component.form.patchValue({ id: 1, name: 'Updated Skill' });
         component.saveSkill();

         expect(skillService.updateSkill).toHaveBeenCalledWith({ id: 1, name: 'Updated Skill' });
         expect(router.navigate).toHaveBeenCalledWith(['/skills']);
      });

      it('should not save when form is invalid', () => {
         component.form.patchValue({ name: '' });
         component.saveSkill();

         expect(skillService.createSkill).not.toHaveBeenCalled();
         expect(skillService.updateSkill).not.toHaveBeenCalled();
      });
   });

   describe('Delete Skill', () => {
      it('should delete skill and navigate away', () => {
         component.form.patchValue({ id: 1 });
         component.deleteSkill();

         expect(skillService.deleteSkill).toHaveBeenCalledWith(1);
         expect(router.navigate).toHaveBeenCalledWith(['/skills']);
      });

      it('should not delete when no ID present', () => {
         component.form.patchValue({ id: null });
         component.deleteSkill();

         expect(skillService.deleteSkill).not.toHaveBeenCalled();
      });
   });
});
