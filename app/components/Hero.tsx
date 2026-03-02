import type { User } from '../types';

export default function Hero({ user }: { user: User }) {
  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center px-6 pt-14 overflow-hidden"
    >
      {/* ambient glow */}
      <div className="absolute -top-40 -left-40 w-150 h-150 rounded-full bg-green-500/4 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-green-600/3 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full py-24 relative z-10">
        <p className="text-green-800 text-xs tracking-[0.3em] font-mono mb-6 uppercase">
          // hello, world
        </p>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight leading-none">
          {user.name}
        </h1>

        {user.title && (
          <p className="text-green-500 font-mono text-xl mb-2 tracking-wide">
            {user.title}
          </p>
        )}

        {user.nickname && (
          <p className="text-green-800 font-mono text-sm mb-8 tracking-widest">
            @{user.nickname}
          </p>
        )}

        {user.bio && (
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed mb-12">
            {user.bio}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <a
            href="#projects"
            className="px-6 py-2.5 bg-green-500 text-black text-sm font-bold hover:bg-green-400 transition-colors tracking-wide"
          >
            view work
          </a>
          {user.github && (
            <a
              href={user.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 border border-green-900/50 text-gray-400 text-sm hover:border-green-800 hover:text-green-400 transition-colors font-mono"
            >
              github
            </a>
          )}
          {user.linkedin && (
            <a
              href={user.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 border border-green-900/50 text-gray-400 text-sm hover:border-green-800 hover:text-green-400 transition-colors font-mono"
            >
              linkedin
            </a>
          )}
          {user.instagram && (
            <a
              href={user.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 border border-green-900/50 text-gray-400 text-sm hover:border-green-800 hover:text-green-400 transition-colors font-mono"
            >
              instagram
            </a>
          )}
        </div>

        {/* scroll hint */}
        <div className="absolute bottom-10 left-6 flex items-center gap-3 opacity-25 select-none">
          <div className="w-px h-10 bg-gradient-to-b from-green-700 to-transparent" />
          <span className="text-green-700 text-xs font-mono tracking-widest -rotate-0">
            scroll
          </span>
        </div>
      </div>
    </section>
  );
}
