'use client';

import { useEffect, useState } from 'react';

const LINKS = [
  { href: '#about', label: 'about', section: 'about' },
  { href: '#experience', label: 'experience', section: 'experience' },
  { href: '#projects', label: 'projects', section: 'projects' },
  { href: '#skills', label: 'skills', section: 'skills' },
  { href: '#education', label: 'education', section: 'education' },
  { href: '#contact', label: 'contact', section: 'contact' },
];

export default function Navbar({
  name,
  sections,
}: {
  name: string;
  sections: Set<string>;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const slug = name.toLowerCase().replace(/\s+/g, '.');
  const visibleLinks = LINKS.filter((l) => sections.has(l.section));

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 h-14 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0a]/95 backdrop-blur border-b border-green-900/25'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
        <a
          href="#"
          className="text-green-400 font-mono text-sm font-bold tracking-wider hover:text-green-300 transition-colors"
        >
          {slug}
        </a>

        {/* desktop */}
        <div className="hidden md:flex items-center gap-8">
          {visibleLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-gray-500 hover:text-green-400 transition-colors text-sm font-mono"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* mobile toggle */}
        <button
          className="md:hidden text-gray-500 hover:text-green-400 transition-colors font-mono text-sm"
          onClick={() => setOpen((o) => !o)}
          aria-label="toggle menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0a0a0a]/98 border-b border-green-900/25 px-6 py-4 flex flex-col gap-4">
          {visibleLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-green-400 transition-colors text-sm font-mono"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
