import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SkillService } from '@jasonhick.com/data-access';

import * as COMPONENTS from '../../components';

@Component({
   selector: 'app-skills',
   standalone: true,
   imports: [CommonModule, COMPONENTS.SkillListComponent, COMPONENTS.SkillDetailComponent, RouterOutlet],
   providers: [SkillService],
   templateUrl: './skills.component.html'
})
export class SkillsComponent implements OnInit {
   private skillService = inject(SkillService);

   public skills$ = this.skillService.skills$;
   public error$ = this.skillService.error$;

   ngOnInit(): void {
      this.skillService.getSkills();
   }
}
