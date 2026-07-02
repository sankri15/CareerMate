import { CATEGORY_COLORS } from '../atsAnalyzer';

export default function SkillBadge({ skill, found }) {
  const colors = CATEGORY_COLORS[skill.category] || CATEGORY_COLORS['Language'];

  if (found) {
    return (
      <span
        className={`skill-badge inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}
        title={`Category: ${skill.category}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.dot}`} />
        {skill.name}
      </span>
    );
  }

  return (
    <span
      className="skill-badge inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border bg-white/[0.02] text-slate-500 border-white/10 line-through decoration-slate-600"
      title={`Missing: ${skill.name} (${skill.category})`}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-slate-600" />
      {skill.name}
    </span>
  );
}
