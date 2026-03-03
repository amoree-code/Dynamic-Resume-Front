'use client';

import { useEffect, useState } from 'react';
import { logout } from '../lib/api';
import LoginForm from './components/LoginForm';
import ProfilePanel from './components/ProfilePanel';
import ProjectsPanel from './components/ProjectsPanel';
import SkillsPanel from './components/SkillsPanel';
import ExperiencePanel from './components/ExperiencePanel';
import EducationPanel from './components/EducationPanel';

type Tab = 'profile' | 'projects' | 'skills' | 'experience' | 'education';

const TABS: { id: Tab; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
];

function Dashboard() {
  const [tab, setTab] = useState<Tab>('profile');
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      <aside className="hidden md:flex flex-col w-52 shrink-0 border-r border-green-900/20 bg-[#0a0a0a]">
        <div className="px-5 py-5 border-b border-green-900/20">
          <p className="text-green-900 text-xs font-mono tracking-widest">
            // admin
          </p>
          <a
            href="/"
            className="text-green-500 font-bold text-sm hover:text-green-300 transition-colors mt-1 block"
          >
            ← portfolio
          </a>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full text-left px-3 py-2 text-sm font-mono transition-colors rounded-sm ${
                tab === t.id
                  ? 'text-green-400 bg-green-900/15 border-l-2 border-green-500 pl-2.5'
                  : 'text-gray-600 hover:text-gray-300 hover:bg-green-900/8 border-l-2 border-transparent'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-green-900/20">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full text-left px-3 py-2 text-sm font-mono text-gray-700 hover:text-red-400 transition-colors disabled:opacity-50"
          >
            {loggingOut ? 'logging out…' : 'logout'}
          </button>
        </div>
      </aside>

      {/* ── mobile top bar ── */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-[#0a0a0a]/95 backdrop-blur border-b border-green-900/20">
        <div className="flex items-center justify-between px-4 py-3">
          <a href="/" className="text-green-500 font-mono text-xs">
            ← portfolio
          </a>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-gray-700 hover:text-red-400 font-mono text-xs transition-colors"
          >
            logout
          </button>
        </div>
        <div className="flex overflow-x-auto border-t border-green-900/15 px-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 px-3 py-2 text-xs font-mono border-b-2 transition-colors ${
                tab === t.id
                  ? 'text-green-400 border-green-500'
                  : 'text-gray-600 border-transparent hover:text-gray-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── main content ── */}
      <main className="flex-1 px-6 py-8 md:py-10 mt-20 md:mt-0 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {tab === 'profile' && <ProfilePanel />}
          {tab === 'projects' && <ProjectsPanel />}
          {tab === 'skills' && <SkillsPanel />}
          {tab === 'experience' && <ExperiencePanel />}
          {tab === 'education' && <EducationPanel />}
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    setAuthed(!!localStorage.getItem('access_token'));
  }, []);

  if (authed === null) return null; // avoid flash

  return authed ? <Dashboard /> : <LoginForm onLogin={() => setAuthed(true)} />;
}
