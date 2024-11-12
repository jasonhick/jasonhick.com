import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Client } from '@jasonhick.com/data-access';

import { ClientListComponent } from './client-list.component';

describe('ClientListComponent', () => {
   let component: ClientListComponent;
   let fixture: ComponentFixture<ClientListComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         imports: [ClientListComponent],
         providers: [provideRouter([])]
      }).compileComponents();

      fixture = TestBed.createComponent(ClientListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should load clients from input', () => {
      const mockClients: Client[] = [{ id: 1, name: 'Test Client' }];

      component.clients = mockClients;
      fixture.detectChanges();

      expect(component.clients).toEqual(mockClients);
      expect(component.clients.length).toBe(1);
   });
});
