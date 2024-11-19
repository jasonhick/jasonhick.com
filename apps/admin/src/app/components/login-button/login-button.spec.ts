import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginButtonComponent } from './login-button';

describe('LoginButtonComponent', () => {
   let component: LoginButtonComponent;
   let fixture: ComponentFixture<LoginButtonComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         imports: [LoginButtonComponent]
      }).compileComponents();

      fixture = TestBed.createComponent(LoginButtonComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
