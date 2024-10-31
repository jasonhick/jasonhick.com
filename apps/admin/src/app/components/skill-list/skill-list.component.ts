import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Skill } from '@jasonhick.com/data-access';

@Component({
   selector: 'app-skill-list',
   standalone: true,
   imports: [CommonModule, RouterLink],
   templateUrl: './skill-list.component.html'
})
export class SkillListComponent {
   @Input() skills: Skill[] = [];
}
