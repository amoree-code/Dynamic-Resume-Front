export interface User {
  id: number;
  name: string;
  surname?: string | null;
  nickname?: string | null;
  email?: string;
  phone1?: string | null;
  phone2?: string | null;
  title?: string | null;
  subtitle?: string | null;
  bio?: string | null;
  github?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
  skills?: Skill[];
  projects?: Project[];
  experiences?: Experience[];
  educations?: Education[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  longDesc?: string;
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  imageUrl?: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
  iconUrl?: string;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  description?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  location?: string;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  gpa?: string;
}

/* ─── form input types (no id) ───────────────────────── */
export interface ProfileInput {
  name: string;
  surname?: string;
  nickname?: string;
  phone1?: string;
  phone2?: string;
  title?: string;
  subtitle?: string;
  bio?: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
}

export interface ProjectInput {
  title: string;
  description: string;
  longDesc?: string;
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  imageUrl?: string;
}

export interface SkillInput {
  name: string;
  category: string;
  level: number;
  iconUrl?: string;
}

export interface ExperienceInput {
  company: string;
  role: string;
  description?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  location?: string;
}

export interface EducationInput {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  gpa?: string;
}
