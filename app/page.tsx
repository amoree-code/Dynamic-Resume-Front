import type { Metadata } from 'next';
import { fetchUser } from './lib/api';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import ExperienceSection from './components/Experience';
import EducationSection from './components/Education';
import Contact from './components/Contact';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const user = await fetchUser();
    const title = user.title ? `${user.name} — ${user.title}` : user.name;
    const description =
      user.bio ??
      `Portfolio of ${user.name}${user.title ? `, ${user.title}` : ''}.`;
    return {
      title,
      description,
      openGraph: { title, description },
      twitter: { title, description },
    };
  } catch {
    return {};
  }
}

export default async function Home() {
  let user;

  try {
    user = await fetchUser();
  } catch (e: unknown) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-3">
          <p className="text-green-900 text-xs font-mono tracking-widest">
            // connection error
          </p>
          <p className="text-red-500 font-mono text-sm">
            {(e as Error).message}
          </p>
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

  return (
    <>
      <Navbar
        name={user.name}
        sections={
          new Set([
            'about',
            ...((user.experiences ?? []).length > 0 ? ['experience'] : []),
            ...((user.projects ?? []).length > 0 ? ['projects'] : []),
            ...((user.skills ?? []).length > 0 ? ['skills'] : []),
            ...((user.educations ?? []).length > 0 ? ['education'] : []),
            'contact',
          ])
        }
      />
      <main>
        <Hero user={user} />
        {(user.experiences ?? []).length > 0 && (
          <ExperienceSection experience={user.experiences!} />
        )}
        {(user.projects ?? []).length > 0 && (
          <Projects projects={user.projects!} />
        )}
        {(user.skills ?? []).length > 0 && <Skills skills={user.skills!} />}
        {(user.educations ?? []).length > 0 && (
          <EducationSection education={user.educations!} />
        )}
        <Contact user={user} />
      </main>
    </>
  );
}
