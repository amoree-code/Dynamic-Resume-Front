import type { Project, ProjectInput } from '../../types';
import { mutate } from '../http';

export const createProject = (data: ProjectInput) =>
  mutate<Project>('POST', '/projects', data);

export const updateProject = (id: number, data: Partial<ProjectInput>) =>
  mutate<Project>('PATCH', `/projects/${id}`, data);

export const deleteProject = (id: number) =>
  mutate<void>('DELETE', `/projects/${id}`);
