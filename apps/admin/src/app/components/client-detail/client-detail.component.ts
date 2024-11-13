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
   private route = inject(ActivatedRoute);
   private clientService = inject(ClientService);

   public buttonText = 'Save Client';
   public client$ = this.fetchClient();
   public form!: FormGroup;
   public fb = inject(FormBuilder);

   /**
    * Lifecycle hook that is called after data-bound properties are initialized.
    *
    * @remarks
    * The form initialization and client data fetching are split into separate private methods
    * for better separation of concerns and testability.
    *
    * @see initForm
    * @see getClient
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
    * Fetches client data based on the route parameter and updates the form
    *
    * @remarks
    * This method performs the following steps:
    * 1. Extracts and parses the clientId from route params
    * 2. Resets form if no clientId is present
    * 3. Fetches client data if clientId exists
    * 4. Updates form with fetched client data
    *
    * The method uses RxJS operators to handle the asynchronous flow:
    * - map: Transforms route params into clientId
    * - switchMap: Switches to client data stream
    * - tap: Updates form with client data or resets form if no client data is fetched
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
