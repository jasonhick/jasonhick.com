import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Skill, SkillService } from '@jasonhick.com/data-access';
import { SkillListComponent } from '../../components/skill-list/skill-list.component';
import { SkillDetailComponent } from '../../components/skill-detail/skill-detail.component';
import { RouterOutlet } from '@angular/router';

@Component({
   selector: 'app-skills',
   standalone: true,
   imports: [CommonModule, SkillListComponent, SkillDetailComponent, RouterOutlet],
   providers: [SkillService],
   templateUrl: './skills.component.html'
})
export class SkillsComponent implements OnInit {
   skills$ = signal<Skill[]>([]);
   loading$ = signal<boolean>(false);
   error$ = signal<string | null>(null);

   constructor(private skillService: SkillService) {
      this.skills$ = this.skillService.skills$;
      this.loading$ = this.skillService.loading$;
      this.error$ = this.skillService.error$;
   }

   ngOnInit(): void {
      this.skillService.getSkills();
   }

   saveSkill(skill: Skill): void {
      this.skillService.saveSkill(skill);
   }
}
