import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkillService } from '@jasonhick.com/data-access';

@Component({
   selector: 'app-skill-list',
   standalone: true,
   imports: [CommonModule, RouterModule],
   templateUrl: './skill-list.component.html'
})
export class SkillListComponent {
   private skillService = inject(SkillService);

   public readonly skills$ = this.skillService.skills$;

   constructor() {
      this.skillService.getSkills();
   }
}
