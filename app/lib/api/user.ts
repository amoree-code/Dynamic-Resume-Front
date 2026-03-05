import { cache } from 'react';
import type { User, ProfileInput } from '../../types';
import { serverGet, mutate } from '../http';

// React.cache deduplicates calls within the same request — so
// generateMetadata and the page component share one fetch, not two.
export const fetchUser = cache(() => serverGet<User>('/users/me'));

export const updateProfile = (data: ProfileInput) =>
  mutate<User>('PATCH', '/users/me', data);
