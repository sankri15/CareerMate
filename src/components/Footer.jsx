export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 px-4 sm:px-6 lg:px-8 pb-8">
      <div className="max-w-5xl mx-auto border-t border-white/[0.06] pt-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
          {/* Author Card */}
          <div className="glass-card rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center gap-4">
            <div>
              <p className="font-bold text-slate-100 text-base mb-2 text-center sm:text-left">Sanjana Pal</p>
              <div className="flex items-center gap-3">
                <a
                  href="mailto:sanjanapal004@gmail.com"
                  title="Email Sanjana Pal"
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl glass-card-3d border border-orange-500/30 text-slate-200 hover:text-white text-xs font-bold hover:bg-white/5 hover:scale-105 transition-all shadow-lg"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center text-[9px] text-white shadow-sm">SP</div>
                  <span>Email Me</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/sanjpal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl glass-card-3d border border-blue-500/30 text-slate-200 hover:text-white text-xs font-bold hover:bg-white/5 hover:scale-105 transition-all shadow-lg"
                >
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          {/* CTA */}
          <a
            href="https://github.com/sanjanapal"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm shimmer-btn transition-all duration-300 hover:scale-105 shadow-xl shadow-orange-900/40"
          >
            <span className="text-base">&#9889;</span>
            View on GitHub
          </a>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {[
            { icon: '&#128274;', label: '100% Private — runs in your browser' },
            { icon: '&#128205;', label: 'Instant ATS scoring' },
            { icon: '&#10024;', label: 'Deep Semantic Analysis' },
          ].map(item => (
            <span
              key={item.label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-slate-400 bg-white/[0.03] border border-white/[0.06]"
              dangerouslySetInnerHTML={{ __html: `<span>${item.icon}</span> ${item.label}` }}
            />
          ))}
        </div>

        {/* Bottom */}
        <p className="text-center text-xs text-slate-600">
          &copy; {currentYear} Sanjana Pal &mdash; CareerMate. Built with React &amp; Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
