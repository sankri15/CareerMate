export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between glass-card rounded-2xl px-5 py-3 border border-white/[0.06]">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white text-sm font-bold shadow-[0_0_15px_rgba(249,115,22,0.3)]">
            C
          </div>
          <span className="font-bold text-slate-100 text-sm hidden sm:block">CareerMate</span>
        </div>

        {/* Author Info */}
        <div className="flex items-center gap-3">
          <a
            href="mailto:sanjanapal004@gmail.com"
            title="Email Sanjana Pal"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl glass-card-3d border border-orange-500/30 text-slate-200 hover:text-white text-xs font-bold hover:bg-white/5 hover:scale-105 transition-all shadow-lg"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center text-[9px] text-white shadow-sm">SP</div>
            <span className="hidden sm:inline">Email Me</span>
          </a>
          <a
            href="https://www.linkedin.com/in/sanjpal"
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn Profile"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl glass-card-3d border border-blue-500/30 text-slate-200 hover:text-white text-xs font-bold hover:bg-white/5 hover:scale-105 transition-all shadow-lg"
          >
            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            <span className="hidden sm:inline">LinkedIn</span>
          </a>
        </div>
      </div>
    </header>
  );
}
