import type { Education, EducationInput } from '../../types';
import { mutate } from '../http';

export const createEducation = (data: EducationInput) =>
  mutate<Education>('POST', '/education', data);

export const updateEducation = (id: number, data: Partial<EducationInput>) =>
  mutate<Education>('PATCH', `/education/${id}`, data);

export const deleteEducation = (id: number) =>
  mutate<void>('DELETE', `/education/${id}`);
