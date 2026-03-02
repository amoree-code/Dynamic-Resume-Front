import type { Experience } from '../types'
import { SectionHeading } from './SectionHeading'

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

const range = (s: string, e?: string, cur?: boolean) =>
  `${fmt(s)} — ${cur ? 'Present' : e ? fmt(e) : 'Present'}`

export default function Experience({
  experience,
}: {
  experience: Experience[]
}) {
  return (
    <section id="experience" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading index="// 03" title="Experience" />

        <div className="relative pl-8">
          {/* vertical timeline line */}
          <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-green-700/60 via-green-900/40 to-transparent" />

          <div className="space-y-14">
            {experience.map((e) => (
              <div key={e.id} className="relative group">
                {/* dot */}
                <div className="absolute -left-[33px] top-1.5 w-2.5 h-2.5 rounded-full bg-green-600 border-2 border-[#0a0a0a] ring-1 ring-green-800 group-hover:bg-green-400 group-hover:ring-green-600 transition-colors" />

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
                  <div>
                    <h3 className="text-white font-bold text-base leading-tight">
                      {e.role}
                    </h3>
                    <p className="text-green-600 text-sm font-mono mt-0.5">
                      {e.company}
                      {e.location && (
                        <span className="text-gray-600"> · {e.location}</span>
                      )}
                    </p>
                  </div>
                  <span className="text-gray-600 font-mono text-xs shrink-0 sm:pt-1 sm:pl-4">
                    {range(e.startDate, e.endDate, e.current)}
                  </span>
                </div>

                {e.description && (
                  <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
                    {e.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
