import { useState, useRef, useEffect } from 'react';
import { Upload, Sparkles, CheckCircle2 } from 'lucide-react';
import { analyzeResume } from '../atsAnalyzer';
import SkillBadge from '../components/SkillBadge';
import SuggestionCard from '../components/SuggestionCard';

export default function Analyzer() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const resultRef = useRef(null);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    setError('');

    try {
      const analysis = await analyzeResume(resumeText, jobDescription);
      setResult(analysis);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Analysis failed. Make sure your API key is configured correctly.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setResumeText('');
    setJobDescription('');
    setResult(null);
    setError('');
  };

  useEffect(() => {
    if (result && resultRef.current) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [result]);

  const wordCount = resumeText.trim() ? resumeText.trim().split(/\s+/).length : 0;

  return (
    <div className="animate-fade-in-up">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        {/* Header section (reverting to a simpler look) */}
        <div className="text-center pt-8 pb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-violet-300 mb-6 border border-violet-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            100% Private
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
            Optimize your resume for <br />
            <span className="gradient-text">Applicant Tracking Systems</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Paste your resume text below, optionally add a target job description, and let our Advanced Neural Engine instantly analyze your profile against modern ATS requirements.
          </p>
        </div>

        {/* Input Area */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4 text-center">
              {error}
            </div>
          )}

          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="resume-input" className="block text-sm font-semibold text-slate-300">
                Paste your resume text
              </label>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${wordCount > 0 ? 'bg-violet-500/20 text-violet-300' : 'bg-slate-800 text-slate-500'}`}>
                {wordCount} words
              </span>
            </div>
            <textarea
              id="resume-input"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="e.g. SOFTWARE ENGINEER&#10;Experience...&#10;Education...&#10;Skills..."
              className="w-full h-48 sm:h-64 bg-black/20 border border-white/10 rounded-2xl p-4 sm:p-5 text-slate-200 placeholder-slate-600 focus:border-violet-500/50 outline-none resize-none transition-all duration-300 shadow-inner"
              spellCheck="false"
            />

            <div className="flex items-center justify-between mb-3 mt-6">
              <label htmlFor="jd-input" className="block text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Sparkles size={16} className="text-blue-400" /> Target Job Description (Optional)
              </label>
            </div>
            <textarea
              id="jd-input"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description here to heavily tailor the ATS scoring and suggestions..."
              className="w-full h-32 bg-black/20 border border-white/10 rounded-2xl p-4 text-slate-200 placeholder-slate-600 focus:border-blue-500/50 outline-none resize-none transition-all duration-300 shadow-inner mb-6"
              spellCheck="false"
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !resumeText.trim()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shimmer-btn hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-violet-900/40 text-base bg-gradient-to-r from-violet-600 to-indigo-600"
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Analyze Resume
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Analyzing Skeleton */}
        {isAnalyzing && (
          <div className="space-y-4 mt-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-white/5 rounded-full w-1/3 mb-4" />
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6].map(j => (
                    <div key={j} className="h-8 bg-white/5 rounded-lg" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {result && !isAnalyzing && (
          <div ref={resultRef} className="space-y-6 mt-8">

            {/* Score Card */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 animated-border result-section stagger-1">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                
                {/* Recreated ScoreRing in place to avoid missing component issues */}
                <div className="flex-shrink-0">
                  <div className="relative inline-flex items-center justify-center w-40 h-40">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/5" />
                      <circle
                        cx="80" cy="80" r="72"
                        stroke="currentColor" strokeWidth="10" fill="transparent"
                        strokeDasharray="452"
                        strokeDashoffset={452 - (452 * result.score) / 100}
                        className={`transition-all duration-1500 ease-out text-${result.scoreColor}-500 drop-shadow-[0_0_15px_rgba(var(--${result.scoreColor}-500),0.5)]`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black">{result.score}</span>
                      <span className={`text-xs font-bold text-${result.scoreColor}-400 mt-1 uppercase tracking-wider`}>{result.scoreLabel}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-slate-100 mb-2">ATS Score Analysis</h2>
                  <p className="text-slate-400 mb-4">
                    Your resume scored{' '}
                    <span className="text-violet-300 font-semibold">{result.score}/100</span> on our
                    ATS compatibility check.{' '}
                    {result.score >= 70
                      ? 'Great job! A few tweaks can push you to the top.'
                      : "There's room to improve — follow the suggestions below."}
                  </p>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Skills Found',   value: result.found.length, icon: '✅' },
                      { label: 'Skills Missing', value: result.missing.length, icon: '❌' },
                      { label: 'Word Count',     value: result.wordCount, icon: '📝' },
                    ].map(stat => (
                      <div
                        key={stat.label}
                        className="bg-white/[0.03] rounded-xl p-3 border border-white/5 text-center"
                      >
                        <div className="text-xl mb-1">{stat.icon}</div>
                        <div className="text-xl font-bold text-slate-100">
                          {stat.value}
                        </div>
                        <div className="text-xs text-slate-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Found */}
            {result.found.length > 0 && (
              <div className="glass-card rounded-2xl p-6 sm:p-8 result-section stagger-2">
                <h2 className="text-xl font-semibold text-slate-100 mb-5 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">✅</span>
                  Skills Found
                  <span className="ml-auto text-sm font-normal text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                    {result.found.length} items
                  </span>
                </h2>
                <div className="flex flex-wrap gap-2">
                  {result.found.map((skill, i) => (
                    <SkillBadge key={i} skill={skill} found={true} />
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {result.missing.length > 0 && (
              <div className="glass-card rounded-2xl p-6 sm:p-8 result-section stagger-3">
                <h2 className="text-xl font-semibold text-slate-100 mb-5 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">❌</span>
                  Missing Skills
                  <span className="ml-auto text-sm font-normal text-red-400 bg-red-400/10 px-3 py-1 rounded-full border border-red-400/20">
                    {result.missing.length} missing
                  </span>
                </h2>
                <p className="text-slate-500 text-sm mb-4">
                  Consider adding these skills to your resume if you have experience with them.
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.missing.map((skill, i) => (
                    <SkillBadge key={i} skill={skill} found={false} />
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div className="glass-card rounded-2xl p-6 sm:p-8 result-section stagger-4">
                <h2 className="text-xl font-semibold text-slate-100 mb-5 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">&#128161;</span>
                  Improvement Suggestions
                  <span className="ml-auto text-sm font-normal text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                    {result.suggestions.length} tips
                  </span>
                </h2>
                <div className="space-y-3">
                  {result.suggestions.map((suggestion, idx) => (
                    <SuggestionCard key={suggestion.id} suggestion={suggestion} index={idx} />
                  ))}
                </div>
              </div>
            )}

            {/* Bonus Details */}
            {result.bonusFound && result.bonusFound.length > 0 && (
              <div className="glass-card rounded-2xl p-6 sm:p-8 result-section stagger-4">
                <h2 className="text-xl font-semibold text-slate-100 mb-5 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center"><CheckCircle2 size={16} className="text-blue-400"/></span>
                  Positive Signals
                  <span className="ml-auto text-sm font-normal text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">
                    {result.bonusFound.length} items
                  </span>
                </h2>
                <ul className="space-y-2">
                  {result.bonusFound.map((bonus, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-blue-300/90 bg-blue-500/10 px-3 py-2 rounded-lg border border-blue-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      {bonus}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="text-center pt-2 pb-8">
              <button
                id="re-analyze-btn"
                onClick={handleClear}
                className="text-sm text-slate-400 hover:text-violet-400 transition-colors underline underline-offset-4"
              >
                Analyze another resume &rarr;
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
