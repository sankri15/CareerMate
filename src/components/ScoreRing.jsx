import { useEffect, useRef } from 'react';

const SCORE_COLORS = {
  green:  { stroke: '#10b981', text: 'text-emerald-400', shadow: 'drop-shadow(0 0 12px rgba(16,185,129,0.5))' },
  blue:   { stroke: '#3b82f6', text: 'text-blue-400',    shadow: 'drop-shadow(0 0 12px rgba(59,130,246,0.5))' },
  yellow: { stroke: '#f59e0b', text: 'text-amber-400',   shadow: 'drop-shadow(0 0 12px rgba(245,158,11,0.5))' },
  red:    { stroke: '#ef4444', text: 'text-red-400',      shadow: 'drop-shadow(0 0 12px rgba(239,68,68,0.5))' },
};

const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScoreRing({ score, scoreLabel, scoreColor }) {
  const circleRef = useRef(null);
  const config = SCORE_COLORS[scoreColor] || SCORE_COLORS.blue;
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

  useEffect(() => {
    if (circleRef.current) {
      // Reset to hidden, then animate
      circleRef.current.style.strokeDashoffset = CIRCUMFERENCE;
      const timeout = setTimeout(() => {
        if (circleRef.current) {
          circleRef.current.style.strokeDashoffset = offset;
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [score, offset]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
      <svg width="200" height="200" viewBox="0 0 200 200" className="rotate-[-90deg]">
        {/* Track */}
        <circle
          cx="100"
          cy="100"
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="14"
        />
        {/* Progress */}
        <circle
          ref={circleRef}
          cx="100"
          cy="100"
          r={RADIUS}
          fill="none"
          stroke={config.stroke}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
          style={{
            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: config.shadow,
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-5xl font-black ${config.text}`}>{score}</span>
        <span className="text-slate-500 text-xs font-medium mt-0.5">out of 100</span>
        <span className={`text-sm font-semibold mt-2 px-3 py-0.5 rounded-full bg-white/5 ${config.text}`}>
          {scoreLabel}
        </span>
      </div>
    </div>
  );
}
