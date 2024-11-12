import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from '@jasonhick.com/data-access';
import { of, Subject } from 'rxjs';

import { ClientDetailComponent } from './client-detail.component';
import { FormErrorComponent } from '../form-error/form-error.component';
import { FormFieldComponent } from '../form-field/form-field.component';

describe('ClientDetailComponent', () => {
   let component: ClientDetailComponent;
   let fixture: ComponentFixture<ClientDetailComponent>;
   let clientService: jest.Mocked<ClientService>;
   let routeParams: Subject<{ clientId?: string }>;

   const mockClient = {
      id: 1,
      name: 'Test Client',
      description: 'Test Description',
      website: 'http://test.com',
      logo_url: 'http://test.com/logo.png',
      start_date: '2024-01-01',
      end_date: '2024-12-31'
   };

   beforeEach(async () => {
      routeParams = new Subject();

      await TestBed.configureTestingModule({
         imports: [ReactiveFormsModule, ClientDetailComponent, FormErrorComponent, FormFieldComponent],
         providers: [
            {
               provide: ClientService,
               useValue: {
                  getClient: jest.fn().mockReturnValue(of(null))
               }
            },
            {
               provide: ActivatedRoute,
               useValue: { params: routeParams }
            }
         ]
      }).compileComponents();

      clientService = TestBed.inject(ClientService) as jest.Mocked<ClientService>;
      fixture = TestBed.createComponent(ClientDetailComponent);
      component = fixture.componentInstance;

      clientService.getClient.mockReturnValue(of(mockClient));
   });

   it('should initialize with empty form', () => {
      fixture.detectChanges();

      expect(clientService.getClient).not.toHaveBeenCalled();
      expect(component.form.value).toEqual({
         id: null,
         name: '',
         description: '',
         website: '',
         logo_url: '',
         start_date: '',
         end_date: ''
      });
   });

   it('should load client data when ID is provided', () => {
      fixture.detectChanges();
      routeParams.next({ clientId: '1' });

      expect(clientService.getClient).toHaveBeenCalledWith(1);
      expect(component.form.value).toEqual({
         id: mockClient.id,
         name: mockClient.name,
         description: mockClient.description,
         website: mockClient.website,
         logo_url: mockClient.logo_url,
         start_date: mockClient.start_date,
         end_date: mockClient.end_date
      });
   });

   it('should display client name in title when loaded', () => {
      fixture.detectChanges();
      routeParams.next({ clientId: '1' });
      fixture.detectChanges();

      const titleElement = fixture.nativeElement.querySelector('h1');
      expect(titleElement.textContent.trim()).toBe('Test Client');
   });

   it('should display "New Client" when no client ID is provided', () => {
      routeParams.next({});
      fixture.detectChanges();

      const titleElement = fixture.nativeElement.querySelector('h1');
      expect(titleElement.textContent.trim()).toBe('New Client');
   });
});
