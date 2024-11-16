import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Client, ClientCreate, ClientService } from '@jasonhick.com/data-access';
import { map, switchMap, tap, take } from 'rxjs';

import { FormErrorComponent } from '../form-error/form-error.component';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
   selector: 'app-client-detail',
   standalone: true,
   imports: [CommonModule, ReactiveFormsModule, FormErrorComponent, FormFieldComponent],
   templateUrl: './client-detail.component.html'
})
export class ClientDetailComponent implements OnInit {
   private fb = inject(FormBuilder);
   private route = inject(ActivatedRoute);
   private router = inject(Router);
   private clientService = inject(ClientService);

   public form!: FormGroup;
   public selectedClient = signal<Client | null>(null);
   public buttonText = signal<string>('Save');

   /**
    * Initializes form and sets up client subscription
    * @see initForm
    * @see setupClientSubscription
    */
   public ngOnInit(): void {
      this.initForm();
      this.setupClientSubscription();
   }

   /**
    * Initializes the form with default values and validation rules
    *
    * @remarks
    * Form controls match the Client model structure with appropriate validators
    */
   private initForm(): void {
      this.form = this.fb.group({
         id: [null],
         name: ['', Validators.required],
         description: [''],
         features: this.fb.array([]),
         location: [''],
         role: [''],
         website: [''],
         start_date: [''],
         end_date: ['']
      });
   }

   /**
    * Sets up subscription to route params to load client data
    *
    * @remarks
    * This method:
    * 1. Extracts clientId from route params
    * 2. Fetches client data if ID exists
    * 3. Updates form and signals with retrieved data
    */
   private setupClientSubscription(): void {
      this.route.params
         .pipe(
            map((params) => (params['clientId'] ? parseInt(params['clientId'], 10) : null)),
            tap(() => {
               this.form.reset();
               this.buttonText.set('Save');
            }),
            switchMap((clientId) => {
               if (!clientId) return [null];
               return this.clientService.getClient(clientId);
            }),
            tap((client) => {
               if (client) {
                  this.patchForm(client);
                  this.selectedClient.set(client);
                  this.buttonText.set('Update');
               }
            })
         )
         .subscribe();
   }

   /**
    * Updates form with client data, formatting dates for input fields
    *
    * @param client - The client data to populate the form with
    */
   private patchForm(client: Client): void {
      const formattedClient = {
         ...client,
         start_date: client.start_date ? new Date(client.start_date).toISOString().split('T')[0] : '',
         end_date: client.end_date ? new Date(client.end_date).toISOString().split('T')[0] : ''
      };

      this.form.patchValue(formattedClient);

      // Clear and rebuild features array
      while (this.features.length) {
         this.features.removeAt(0);
      }

      client.features?.forEach((feature) => {
         this.features.push(this.fb.control(feature));
      });
   }

   /**
    * Saves or updates client data based on form submission
    *
    * @description
    * - Validates form before submission
    * - Formats dates to ISO strings for API
    * - Creates new client or updates existing based on ID
    * - Refreshes client list and redirects on success
    *
    * @throws Will not proceed if form is invalid
    */
   public saveClient(): void {
      if (this.form.valid) {
         const { id, ...formData } = this.form.value;

         const data: ClientCreate = {
            name: formData.name,
            description: formData.description,
            features: formData.features,
            location: formData.location,
            role: formData.role,
            website: formData.website,
            start_date: formData.start_date ? new Date(formData.start_date).toISOString() : '',
            end_date: formData.end_date ? new Date(formData.end_date).toISOString() : ''
         };

         const save$ = id ? this.clientService.updateClient({ id, ...data }) : this.clientService.saveClient(data);

         save$
            .pipe(
               take(1),
               tap(() => {
                  this.clientService.getClients(); // Refresh the clients list
                  this.router.navigate(['/clients']);
               })
            )
            .subscribe();
      }
   }

   /**
    * Gets the features FormArray from the form
    *
    * @returns FormArray containing the features controls
    */
   public get features(): FormArray {
      return this.form.get('features') as FormArray;
   }

   /**
    * Adds a new empty feature control to the features FormArray
    *
    * @remarks
    * Creates a new FormControl with an empty string value and adds it to the end of the array
    */
   public addFeature(): void {
      this.features.push(this.fb.control(''));
   }

   /**
    * Removes a feature control at the specified index
    *
    * @param index - The index of the feature to remove
    *
    * @remarks
    * Removes the FormControl at the given index from the features FormArray
    */
   public removeFeature(index: number): void {
      this.features.removeAt(index);
   }
}
