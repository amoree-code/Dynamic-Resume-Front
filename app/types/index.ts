export interface User {
  id: number
  name: string
  nickname?: string
  email: string
  avatar?: string
  github?: string
  linkedin?: string
  bio?: string
  skills?: Skill[]
  projects?: Project[]
  experience?: Experience[]
  education?: Education[]
}

export interface Project {
  id: number
  title: string
  description: string
  longDesc?: string
  techStack: string[]
  liveUrl?: string
  repoUrl?: string
  imageUrl?: string
}

export interface Skill {
  id: number
  name: string
  category: string
  level: number
  iconUrl?: string
}

export interface Experience {
  id: number
  company: string
  role: string
  description?: string
  startDate: string
  endDate?: string
  current?: boolean
  location?: string
}

export interface Education {
  id: number
  institution: string
  degree: string
  field: string
  startDate: string
  endDate?: string
  current?: boolean
  gpa?: string
}
