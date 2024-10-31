import { Client, Image, Project, Skill } from './data-contracts';
import { createService } from './factory/service.factory';

export const ClientService = createService<Client>('clients');
export const ImageService = createService<Image>('images');
export const ProjectService = createService<Project>('projects');
export const SkillService = createService<Skill>('skills');
export * from './data-contracts';
