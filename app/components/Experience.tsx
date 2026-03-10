import type { Experience } from '../types';
import { SectionHeading } from './SectionHeading';

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

const range = (s: string, e?: string, cur?: boolean) =>
  `${fmt(s)} — ${cur ? 'Present' : e ? fmt(e) : 'Present'}`;

export default function Experience({
  experience,
}: {
  experience: Experience[];
}) {
  return (
    <section id="experience" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading index="// 01" title="Experience" />

        <div className="relative pl-8">
          {/* vertical timeline line */}
          <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-green-700/60 via-green-900/40 to-transparent" />

          <div className="space-y-14">
            {[...experience]
              .sort((a, b) => {
                if (a.current && !b.current) return -1;
                if (!a.current && b.current) return 1;
                return (
                  new Date(b.startDate).getTime() -
                  new Date(a.startDate).getTime()
                );
              })
              .map((e) => (
                <div key={e.id} className="relative group">
                  {/* dot */}
                  <div className="absolute -left-[33px] top-1.5 w-2.5 h-2.5 rounded-full bg-green-600 border-2 border-[#0a0a0a] ring-1 ring-green-800 group-hover:bg-green-400 group-hover:ring-green-600 transition-colors" />

                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
                    <div>
                      <p className="text-green-500 font-bold text-lg leading-tight">
                        {e.company}
                        {e.location && (
                          <span className="text-gray-600 font-normal text-sm">
                            {' '}
                            · {e.location}
                          </span>
                        )}
                      </p>
                      <h3 className="text-gray-300 font-mono text-sm mt-0.5">
                        {e.role}
                      </h3>
                    </div>
                    <span className="text-gray-600 font-mono text-xs shrink-0 sm:pt-1 sm:pl-4">
                      {range(e.startDate, e.endDate, e.current)}
                    </span>
                  </div>

                  {e.description && (
                    <ul className="space-y-1 max-w-2xl">
                      {e.description
                        .split('\n')
                        .map((line) => line.replace(/^-\s*/, '').trim())
                        .filter(Boolean)
                        .map((line, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-gray-500 text-sm leading-relaxed"
                          >
                            <span className="text-green-800 mt-1 shrink-0">
                              —
                            </span>
                            {line}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
