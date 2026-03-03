import type { Skill } from '../types';
import { SectionHeading } from './SectionHeading';

export default function Skills({ skills }: { skills: Skill[] }) {
  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <section id="skills" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading index="// 03" title="Skills" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const catSkills = skills
              .filter((s) => s.category === cat)
              .sort((a, b) => b.level - a.level);

            return (
              <div
                key={cat}
                className="border border-green-900/30 bg-[#0d0d0d] p-6 hover:border-green-800/50 transition-colors"
              >
                <h3 className="text-green-600 text-xs font-mono tracking-[0.2em] uppercase mb-5">
                  {cat}
                </h3>

                <div className="space-y-4">
                  {catSkills.map((s) => (
                    <div key={s.id}>
                      <div className="flex justify-between items-baseline mb-1.5">
                        <span className="text-gray-300 text-sm">{s.name}</span>
                        <span className="text-gray-700 text-xs font-mono">
                          {s.level}%
                        </span>
                      </div>
                      <div className="h-px bg-green-950 relative overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-green-500"
                          style={{ width: `${s.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
