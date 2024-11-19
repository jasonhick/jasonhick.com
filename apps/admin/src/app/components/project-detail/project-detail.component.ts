import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
   Project,
   ProjectCreate,
   ProjectService,
   ClientService,
   SkillService,
   Client,
   Skill
} from '@jasonhick.com/data-access';
import { map, switchMap, tap, take } from 'rxjs';

import { FormErrorComponent } from '../form-error/form-error.component';
import { FormFieldComponent } from '../form-field/form-field.component';

/**
 * Component for managing individual project details
 *
 * @description
 * Provides a form interface for:
 * - Creating new projects
 * - Editing existing projects
 * - Managing project features
 *
 * @remarks
 * - Uses signals for reactive state management
 * - Automatically syncs form with selected project
 * - Handles form validation
 * - Manages relationships with clients and skills
 */
@Component({
   selector: 'app-project-detail',
   standalone: true,
   imports: [CommonModule, ReactiveFormsModule, FormErrorComponent, FormFieldComponent],
   templateUrl: './project-detail.component.html'
})
export class ProjectDetailComponent implements OnInit {
   private fb = inject(FormBuilder);
   private route = inject(ActivatedRoute);
   private router = inject(Router);
   private projectService = inject(ProjectService);
   private clientService = inject(ClientService);
   private skillService = inject(SkillService);

   public form!: FormGroup;
   public selectedProject = signal<Project | null>(null);
   public clients = signal<Client[]>([]);
   public skills = signal<Skill[]>([]);
   public buttonText = signal<string>('Save');

   public ngOnInit(): void {
      this.initForm();
      this.setupProjectSubscription();
      this.loadClients();
      this.loadSkills();
   }

   private initForm(): void {
      this.form = this.fb.group({
         id: [null],
         client_id: [null, Validators.required],
         description: ['', Validators.required],
         end_date: [''],
         features: this.fb.array([]),
         github_url: [''],
         is_featured: [false],
         live_url: [''],
         skills: [[]],
         start_date: [''],
         title: ['', Validators.required]
      });
   }

   private setupProjectSubscription(): void {
      this.route.params
         .pipe(
            map((params) => (params['projectId'] ? parseInt(params['projectId'], 10) : null)),
            tap(() => {
               this.form.reset();
               this.buttonText.set('Save');
            }),
            switchMap((projectId) => {
               if (!projectId) return [null];
               return this.projectService.getProject(projectId);
            }),
            tap((project) => {
               if (project) {
                  this.patchForm(project);
                  this.selectedProject.set(project);
                  this.buttonText.set('Update');
               }
            })
         )
         .subscribe();
   }

   private loadClients(): void {
      this.clientService.getClients();
      this.clients = this.clientService.clients$;
   }

   private loadSkills(): void {
      this.skillService.getSkills();
      this.skills = this.skillService.skills$;
   }

   private patchForm(project: Project): void {
      const formattedProject = {
         ...project,
         start_date: project.start_date ? new Date(project.start_date).toISOString().split('T')[0] : '',
         end_date: project.end_date ? new Date(project.end_date).toISOString().split('T')[0] : ''
      };

      this.form.patchValue(formattedProject);

      const featuresArray = this.form.get('features') as FormArray;
      while (featuresArray.length) {
         featuresArray.removeAt(0);
      }

      project.features?.forEach((feature) => {
         featuresArray.push(this.fb.control(feature));
      });
   }

   public get features(): FormArray {
      return this.form.get('features') as FormArray;
   }

   public addFeature(): void {
      this.features.push(this.fb.control(''));
   }

   public removeFeature(index: number): void {
      this.features.removeAt(index);
   }

   /**
    * Saves or updates project data based on form submission
    *
    * @description
    * - Validates form before submission
    * - Formats dates to ISO strings for API
    * - Creates new project or updates existing based on ID
    * - Refreshes project list and redirects on success
    *
    * @throws Will not proceed if form is invalid
    */
   public saveProject(): void {
      if (this.form.valid) {
         const { id, ...formData } = this.form.value;

         const cleanedData: Partial<Project> = Object.fromEntries(
            Object.entries(formData).filter(([, value]) => value !== null)
         );

         const data: ProjectCreate = {
            title: formData.title,
            ...cleanedData,
            start_date: formData.start_date ? new Date(formData.start_date).toISOString() : '',
            end_date: formData.end_date ? new Date(formData.end_date).toISOString() : ''
         };

         data.client_id = Number(data.client_id);

         const save$ = id ? this.projectService.updateProject({ id, ...data }) : this.projectService.saveProject(data);

         save$
            .pipe(
               take(1),
               tap(() => {
                  this.projectService.getProjects();
                  this.router.navigate(['../'], { relativeTo: this.route });
               })
            )
            .subscribe();
      }
   }

   /**
    * Deletes the current project
    *
    * @description
    * - Only proceeds if a project is selected (has ID)
    * - Deletes project and redirects to projects list
    * - Refreshes projects list after deletion
    */
   public deleteProject(): void {
      const id = this.form.get('id')?.value;

      if (id) {
         this.projectService
            .deleteProject(id)
            .pipe(
               take(1),
               tap(() => {
                  this.router.navigate(['../'], { relativeTo: this.route });
               })
            )
            .subscribe();
      }
   }

   public updateSkills(event: Event, skillId: number): void {
      const checkbox = event.target as HTMLInputElement;
      const currentSkills = this.form.get('skills')?.value || [];

      if (checkbox.checked) {
         this.form.get('skills')?.setValue([...currentSkills, skillId]);
      } else {
         this.form.get('skills')?.setValue(currentSkills.filter((id: number) => id !== skillId));
      }
   }

   isSkillSelected(skillId: number | undefined): boolean {
      if (!skillId) return false;
      const skills = this.form.get('skills')?.value || [];
      return skills.includes(skillId);
   }

   onSkillChange(event: Event, skillId: number | undefined) {
      if (!skillId) return;
      const checkbox = event.target as HTMLInputElement;
      const skills = [...(this.form.get('skills')?.value || [])];

      if (checkbox.checked && !skills.includes(skillId)) {
         skills.push(skillId);
      } else if (!checkbox.checked) {
         const index = skills.indexOf(skillId);
         if (index > -1) {
            skills.splice(index, 1);
         }
      }

      this.form.patchValue({ skills });
   }
}
