import type { Project } from '../types'
import { SectionHeading } from './SectionHeading'

export default function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading index="// 02" title="Projects" />

        <div className="grid md:grid-cols-2 gap-5">
          {projects.map((p) => (
            <article
              key={p.id}
              className="group border border-green-900/30 bg-[#0d0d0d] p-6 flex flex-col hover:border-green-700/50 transition-all duration-200"
            >
              {/* top accent line */}
              <div className="w-8 h-px bg-green-600 mb-5 group-hover:w-full transition-all duration-500" />

              <h3 className="text-white font-bold text-lg mb-3 group-hover:text-green-300 transition-colors">
                {p.title}
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed mb-5 flex-1">
                {p.longDesc ?? p.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {p.techStack.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-mono text-green-700 bg-green-950/40 border border-green-900/40 px-2 py-0.5"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {(p.liveUrl || p.repoUrl) && (
                <div className="flex gap-5 pt-4 border-t border-green-900/20">
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-green-500 hover:text-green-300 transition-colors tracking-widest"
                    >
                      → live
                    </a>
                  )}
                  {p.repoUrl && (
                    <a
                      href={p.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-gray-600 hover:text-gray-400 transition-colors tracking-widest"
                    >
                      → source
                    </a>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
