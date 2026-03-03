export function SectionHeading({
  index,
  title,
}: {
  index: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-4 mb-14">
      <span className="text-green-900 text-xs font-mono tracking-widest shrink-0">
        {index}
      </span>
      <h2 className="text-2xl font-bold text-white tracking-tight whitespace-nowrap">
        {title}
      </h2>
      <div className="flex-1 h-px bg-linear-to-r from-green-900/50 to-transparent" />
    </div>
  );
}
