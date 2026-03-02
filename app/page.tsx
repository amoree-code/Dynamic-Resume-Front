'use client';

import { useEffect, useState } from 'react';
import { fetchUser } from './lib/api';
import type { User } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import ExperienceSection from './components/Experience';
import EducationSection from './components/Education';
import Contact from './components/Contact';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUser()
      .then(setUser)
      .catch((e: Error) => setError(e.message));
  }, []);

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
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-green-900 font-mono text-sm animate-pulse tracking-widest">
          // initializing…
        </span>
      </div>
    );
  }

  return (
    <>
      <Navbar name={user.name} />
      <main>
        <Hero user={user} />
        {(user.experience ?? []).length > 0 && (
          <ExperienceSection experience={user.experience!} />
        )}
        {(user.projects ?? []).length > 0 && <Projects projects={user.projects!} />}
        {(user.skills ?? []).length > 0 && <Skills skills={user.skills!} />}
        {(user.education ?? []).length > 0 && (
          <EducationSection education={user.education!} />
        )}
        <Contact user={user} />
      </main>
    </>
  );
}
