import type { Experience, ExperienceInput } from '../../types';
import { mutate } from '../http';

export const createExperience = (data: ExperienceInput) =>
  mutate<Experience>('POST', '/experience', data);

export const updateExperience = (id: number, data: Partial<ExperienceInput>) =>
  mutate<Experience>('PATCH', `/experience/${id}`, data);

export const deleteExperience = (id: number) =>
  mutate<void>('DELETE', `/experience/${id}`);
