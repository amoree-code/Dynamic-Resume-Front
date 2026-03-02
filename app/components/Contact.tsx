import type { User } from '../types'

export default function Contact({ user }: { user: User }) {
  const year = new Date().getFullYear()

  return (
    <section id="contact" className="py-28 px-6 border-t border-green-900/20">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-14">
          <span className="text-green-900 text-xs font-mono tracking-widest">
            // 05
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight whitespace-nowrap">
            Contact
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-green-900/50 to-transparent" />
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-12">
          <div className="max-w-md">
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Open to new opportunities, collaborations, and interesting
              conversations. Reach out anytime.
            </p>
            <a
              href={`mailto:${user.email}`}
              className="inline-block text-xl sm:text-2xl text-green-400 hover:text-green-300 transition-colors font-mono break-all border-b border-green-900 hover:border-green-700 pb-1"
            >
              {user.email}
            </a>
          </div>

          <div className="flex flex-col gap-4 min-w-[160px]">
            <p className="text-gray-700 text-xs font-mono tracking-widest uppercase mb-2">
              // find me
            </p>
            {user.github && (
              <a
                href={user.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-500 hover:text-green-400 transition-colors text-sm font-mono group"
              >
                <span className="text-green-900 group-hover:text-green-600 transition-colors">
                  →
                </span>
                github
              </a>
            )}
            {user.linkedin && (
              <a
                href={user.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-500 hover:text-green-400 transition-colors text-sm font-mono group"
              >
                <span className="text-green-900 group-hover:text-green-600 transition-colors">→</span>
                linkedin
              </a>
            )}
            {user.instagram && (
              <a
                href={user.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-500 hover:text-green-400 transition-colors text-sm font-mono group"
              >
                <span className="text-green-900 group-hover:text-green-600 transition-colors">→</span>
                instagram
              </a>
            )}
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-green-900/10 flex items-center justify-between text-gray-700 text-xs font-mono">
          <span>{user.name.toLowerCase().replace(/\s+/g, '.')}</span>
          <span>{year}</span>
        </div>
      </div>
    </section>
  )
}
