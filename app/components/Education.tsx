import type { Education } from '../types'
import { SectionHeading } from './SectionHeading'

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

const range = (s: string, e?: string, cur?: boolean) =>
  `${fmt(s)} — ${cur ? 'Present' : e ? fmt(e) : 'Present'}`

export default function Education({ education }: { education: Education[] }) {
  return (
    <section id="education" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading index="// 04" title="Education" />

        <div className="grid sm:grid-cols-2 gap-5">
          {education.map((e) => (
            <div
              key={e.id}
              className="border border-green-900/30 bg-[#0d0d0d] p-6 hover:border-green-800/50 transition-colors group"
            >
              <p className="text-green-800 text-xs font-mono tracking-widest uppercase mb-3 group-hover:text-green-700 transition-colors">
                {range(e.startDate, e.endDate, e.current)}
              </p>

              <h3 className="text-white font-bold text-base mb-1 leading-snug">
                {e.degree}
                <span className="text-gray-500"> in </span>
                {e.field}
              </h3>

              <p className="text-green-600 text-sm font-mono">{e.institution}</p>

              {e.gpa && (
                <p className="text-gray-600 text-xs font-mono mt-3">
                  GPA{' '}
                  <span className="text-gray-400">{e.gpa}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
