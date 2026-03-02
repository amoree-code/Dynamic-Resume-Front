'use client'

import { useEffect, useState } from 'react'
import {
  fetchUser,
  fetchSkills,
  fetchProjects,
  fetchExperience,
  fetchEducation,
} from './lib/api'
import type { User, Skill, Project, Experience, Education } from './types'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Skills from './components/Skills'
import Projects from './components/Projects'
import ExperienceSection from './components/Experience'
import EducationSection from './components/Education'
import Contact from './components/Contact'

interface PortfolioData {
  user: User
  skills: Skill[]
  projects: Project[]
  experience: Experience[]
  education: Education[]
}

export default function Home() {
  const [data, setData] = useState<PortfolioData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetchUser(),
      fetchSkills(),
      fetchProjects(),
      fetchExperience(),
      fetchEducation(),
    ])
      .then(([user, skills, projects, experience, education]) =>
        setData({ user, skills, projects, experience, education }),
      )
      .catch((e: Error) => setError(e.message))
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-3">
          <p className="text-green-900 text-xs font-mono tracking-widest">
            // connection error
          </p>
          <p className="text-red-500 font-mono text-sm">{error}</p>
          <p className="text-gray-700 text-xs font-mono">
            API:{' '}
            <span className="text-green-900">
              {process.env.NEXT_PUBLIC_API_URL}
            </span>
          </p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-green-900 font-mono text-sm animate-pulse tracking-widest">
          // initializing…
        </span>
      </div>
    )
  }

  return (
    <>
      <Navbar name={data.user.name} />
      <main>
        <Hero user={data.user} />
        {data.skills.length > 0 && <Skills skills={data.skills} />}
        {data.projects.length > 0 && <Projects projects={data.projects} />}
        {data.experience.length > 0 && (
          <ExperienceSection experience={data.experience} />
        )}
        {data.education.length > 0 && (
          <EducationSection education={data.education} />
        )}
        <Contact user={data.user} />
      </main>
    </>
  )
}
