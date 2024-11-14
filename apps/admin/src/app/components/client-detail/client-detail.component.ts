import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Client, ClientCreate, ClientService } from '@jasonhick.com/data-access';
import { map, switchMap, tap, of, Observable } from 'rxjs';

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
   private clientService = inject(ClientService);

   public buttonText = 'Save Client';
   public client$ = this.fetchClient();
   public form!: FormGroup;

   /**
    * Initializes form after component is created
    * @see initForm
    */
   public ngOnInit(): void {
      this.initForm();
   }

   /**
    * Initializes the form with default values and validation rules
    */
   private initForm(): void {
      this.form = this.fb.group({
         id: [null],
         name: ['', Validators.required],
         description: ['', Validators.required],
         website: [''],
         logo_url: [''],
         start_date: ['', Validators.required],
         end_date: ['', Validators.required]
      });
   }

   /**
    * Fetches a client based on the route parameter 'clientId'.
    * If clientId exists, retrieves the client from the service.
    * Resets form and updates button text based on whether editing existing or creating new.
    *
    * @remarks
    * This method performs the following steps:
    * 1. Extracts and parses the clientId from route params
    * 2. Resets the form and sets default button text
    * 3. If clientId exists, fetches client data from service
    * 4. Updates form with client data if found
    *
    * @returns Observable that emits the fetched Client or null if creating new
    * @see ClientService.getClient
    */
   private fetchClient(): Observable<Client | null> {
      return this.route.params.pipe(
         map((params) => (params['clientId'] ? parseInt(params['clientId'], 10) : null)),
         tap(() => {
            this.form.reset();
            this.buttonText = 'Save Client';
         }),
         switchMap((clientId) => {
            if (!clientId) return of(null);
            return this.clientService.getClient(clientId);
         }),
         tap((client) => {
            if (client) {
               this.patchForm(client);
               this.buttonText = 'Update Client';
            }
         })
      );
   }

   /**
    * Updates the form with client data, formatting dates for the form inputs
    *
    * @param client - The client data to populate the form with
    *
    * @remarks
    * This method performs the following:
    * 1. Creates a copy of the client object
    * 2. Formats start_date and end_date from ISO strings to YYYY-MM-DD format for date inputs
    * 3. Updates the form values using Angular's patchValue
    */
   private patchForm(client: Client): void {
      const formattedClient = {
         ...client,
         start_date: client.start_date ? new Date(client.start_date).toISOString().split('T')[0] : '',
         end_date: client.end_date ? new Date(client.end_date).toISOString().split('T')[0] : ''
      };

      this.form.patchValue(formattedClient);
   }

   /**
    * Saves or updates client data based on form submission
    *
    * @remarks
    * This method performs the following:
    * 1. Validates the form
    * 2. Extracts id and form data from the form values
    * 3. Creates a ClientCreate object with formatted dates
    * 4. Calls appropriate service method based on whether it's a new or existing client
    *
    * The dates are converted from the HTML date input format (YYYY-MM-DD)
    * to ISO format required by the API
    *
    * If the form is invalid, no action is taken
    */
   public saveClient(): void {
      if (this.form.valid) {
         const { id, ...formData } = this.form.value;

         const data: ClientCreate = {
            name: formData.name,
            description: formData.description,
            website: formData.website,
            logo_url: formData.logo_url,
            start_date: formData.start_date ? new Date(formData.start_date).toISOString() : '',
            end_date: formData.end_date ? new Date(formData.end_date).toISOString() : ''
         };

         if (id) {
            this.clientService.updateClient({ id, ...data }).subscribe();
         } else {
            this.clientService.saveClient(data).subscribe();
         }
      }
   }
}
