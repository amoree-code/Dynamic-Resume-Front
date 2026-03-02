import type { User, Project, Skill, Experience, Education } from '../types'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('_rt')
}

async function get<T>(path: string): Promise<T> {
  const token = getToken()
  const res = await fetch(`${API}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

export const fetchUser = () => get<User>('/users/me')
export const fetchProjects = () => get<Project[]>('/projects')
export const fetchProject = (id: number | string) => get<Project>(`/projects/${id}`)
export const fetchSkills = () => get<Skill[]>('/skills')
export const fetchExperience = () => get<Experience[]>('/experience')
export const fetchEducation = () => get<Education[]>('/education')

export async function login(email: string, password: string): Promise<string> {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error('Invalid credentials')
  const data = await res.json()
  localStorage.setItem('_rt', data.accessToken)
  return data.accessToken
}

export async function logout(): Promise<void> {
  const token = getToken()
  if (!token) throw new Error('Not logged in')
  await fetch(`${API}/auth/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  localStorage.removeItem('_rt')
}
