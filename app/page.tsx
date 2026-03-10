import type { Metadata } from 'next';
import { fetchUser } from './lib/api';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import ExperienceSection from './components/Experience';
import EducationSection from './components/Education';
import Contact from './components/Contact';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const user = await fetchUser();
    const fullName = [user.name, user.surname].filter(Boolean).join(' ');
    const title = user.title ? `${fullName} — ${user.title}` : fullName;
    const description =
      user.bio ??
      `Portfolio of ${fullName}${user.title ? `, ${user.title}` : ''}.`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';

    return {
      title,
      description,
      alternates: { canonical: siteUrl || '/' },
      openGraph: {
        title,
        description,
        type: 'profile',
        ...(user.name && { firstName: user.name }),
        ...(user.surname && { lastName: user.surname }),
        ...(user.nickname && { username: user.nickname }),
        ...(siteUrl && { url: siteUrl }),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
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

  const fullName = [user.name, user.surname].filter(Boolean).join(' ');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const sameAs = [user.github, user.linkedin, user.instagram].filter(Boolean);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: fullName,
    ...(user.title && { jobTitle: user.title }),
    ...(user.bio && { description: user.bio }),
    ...(user.email && { email: user.email }),
    ...(siteUrl && { url: siteUrl }),
    ...(sameAs.length > 0 && { sameAs }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
