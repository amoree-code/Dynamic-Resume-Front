import type {
  User,
  Project,
  Skill,
  Experience,
  Education,
  ProfileInput,
  ProjectInput,
  SkillInput,
  ExperienceInput,
  EducationInput,
} from '../types';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('_rt');
}

async function get<T>(path: string): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export const fetchUser = () => get<User>('/users/me');
export const fetchProjects = () => get<Project[]>('/projects');
export const fetchProject = (id: number | string) =>
  get<Project>(`/projects/${id}`);
export const fetchSkills = () => get<Skill[]>('/skills');
export const fetchExperience = () => get<Experience[]>('/experience');
export const fetchEducation = () => get<Education[]>('/education');

export async function login(email: string, password: string): Promise<string> {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Invalid credentials');
  const data = await res.json();
  localStorage.setItem('_rt', data.accessToken);
  return data.accessToken;
}

async function mutate<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  if (res.status === 204 || res.headers.get('content-length') === '0')
    return undefined as T;
  return res.json();
}

/* ─── profile ─────────────────────────────────────────── */
export const updateProfile = (data: ProfileInput) =>
  mutate<User>('PATCH', '/users/me', data);

/* ─── projects ────────────────────────────────────────── */
export const createProject = (data: ProjectInput) =>
  mutate<Project>('POST', '/projects', data);
export const updateProject = (id: number, data: Partial<ProjectInput>) =>
  mutate<Project>('PATCH', `/projects/${id}`, data);
export const deleteProject = (id: number) =>
  mutate<void>('DELETE', `/projects/${id}`);

/* ─── skills ──────────────────────────────────────────── */
export const createSkill = (data: SkillInput) =>
  mutate<Skill>('POST', '/skills', data);
export const updateSkill = (id: number, data: Partial<SkillInput>) =>
  mutate<Skill>('PATCH', `/skills/${id}`, data);
export const deleteSkill = (id: number) =>
  mutate<void>('DELETE', `/skills/${id}`);

/* ─── experience ──────────────────────────────────────── */
export const createExperience = (data: ExperienceInput) =>
  mutate<Experience>('POST', '/experience', data);
export const updateExperience = (id: number, data: Partial<ExperienceInput>) =>
  mutate<Experience>('PATCH', `/experience/${id}`, data);
export const deleteExperience = (id: number) =>
  mutate<void>('DELETE', `/experience/${id}`);

/* ─── education ───────────────────────────────────────── */
export const createEducation = (data: EducationInput) =>
  mutate<Education>('POST', '/education', data);
export const updateEducation = (id: number, data: Partial<EducationInput>) =>
  mutate<Education>('PATCH', `/education/${id}`, data);
export const deleteEducation = (id: number) =>
  mutate<void>('DELETE', `/education/${id}`);

export async function logout(): Promise<void> {
  const token = getToken();
  if (!token) throw new Error('Not logged in');
  await fetch(`${API}/auth/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  localStorage.removeItem('_rt');
}
