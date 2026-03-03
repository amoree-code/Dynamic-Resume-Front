import type { User, ProfileInput } from '../../types';
import { get, mutate } from '../http';

export const fetchUser = () => get<User>('/users/me');

export const updateProfile = (data: ProfileInput) =>
  mutate<User>('PATCH', '/users/me', data);
