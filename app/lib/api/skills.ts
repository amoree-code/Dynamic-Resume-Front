import type { Skill, SkillInput } from '../../types';
import { mutate } from '../http';

export const createSkill = (data: SkillInput) =>
  mutate<Skill>('POST', '/skills', data);

export const updateSkill = (id: number, data: Partial<SkillInput>) =>
  mutate<Skill>('PATCH', `/skills/${id}`, data);

export const deleteSkill = (id: number) =>
  mutate<void>('DELETE', `/skills/${id}`);
