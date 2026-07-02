import { PRIORITY_CONFIG } from '../atsAnalyzer';

export default function SuggestionCard({ suggestion, index }) {
  const config = PRIORITY_CONFIG[suggestion.priority] || PRIORITY_CONFIG.medium;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border ${config.bg} ${config.border} transition-all duration-200 hover:scale-[1.01]`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <span className="text-base flex-shrink-0 mt-0.5">{config.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-slate-300 text-sm leading-relaxed">{suggestion.message}</p>
        <span className={`mt-1 inline-block text-xs font-medium ${config.color}`}>
          {config.label}
        </span>
      </div>
    </div>
  );
}
