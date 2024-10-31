import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientsComponent } from './clients.component';
import { ClientFormComponent } from '../../components/client-detail/client-detail.component';
import { ClientListComponent } from '../../components/client-list/client-list.component';

describe('ClientsComponent', () => {
   let component: ClientsComponent;
   let fixture: ComponentFixture<ClientsComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         imports: [ClientListComponent, ClientFormComponent]
      }).compileComponents();

      fixture = TestBed.createComponent(ClientsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
