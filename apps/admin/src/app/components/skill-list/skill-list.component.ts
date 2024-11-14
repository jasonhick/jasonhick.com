import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Skill } from '@jasonhick.com/data-access';

@Component({
   selector: 'app-skill-list',
   standalone: true,
   imports: [CommonModule, RouterModule],
   templateUrl: './skill-list.component.html'
})
export class SkillListComponent {
   @Input() skills: Skill[] = [];
   public router = inject(Router);
}
