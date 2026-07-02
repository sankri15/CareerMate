import { Link } from 'react-router-dom';
import { FileText, LayoutTemplate, MessageSquare, Database, ArrowRight, Zap, Shield, Target } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

export default function Home() {
  return (
    <div className="animate-fade-in-up">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 text-center overflow-hidden min-h-[80vh] flex flex-col justify-center items-center">
        
        {/* Massive 3D Glowing Background */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[100px] pointer-events-none animate-float" />
        <div
          className="absolute bottom-10 right-1/4 w-[30rem] h-[30rem] bg-rose-500/15 rounded-full blur-[120px] pointer-events-none animate-float-reverse"
          style={{ animationDelay: '2s' }}
        />

        {/* 3D Wireframe Globe Animation (patience520700 style) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-40 mix-blend-screen z-0 perspective-1000">
          <div className="absolute inset-0 rounded-full border border-orange-500/30 animate-[spin_10s_linear_infinite]" style={{ transform: 'rotateX(60deg)' }}></div>
          <div className="absolute inset-0 rounded-full border border-rose-500/30 animate-[spin_15s_linear_infinite_reverse]" style={{ transform: 'rotateX(60deg) rotateY(45deg)' }}></div>
          <div className="absolute inset-0 rounded-full border border-amber-500/30 animate-[spin_12s_linear_infinite]" style={{ transform: 'rotateX(60deg) rotateY(-45deg)' }}></div>
          <div className="absolute inset-0 rounded-full border border-orange-400/20 animate-[spin_20s_linear_infinite]" style={{ transform: 'rotateX(90deg)' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-orange-500/10 to-rose-500/10 rounded-full blur-2xl animate-pulse-glow"></div>
        </div>

        <ScrollReveal className="relative max-w-5xl mx-auto z-10 perspective-1000">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card-3d backdrop-blur-2xl text-sm font-semibold text-orange-200 mb-8 border border-white/20 shadow-[0_0_20px_rgba(249,115,22,0.2)]">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse-glow" />
            Next-Generation Career Optimization
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tight drop-shadow-2xl text-white">
            Land your dream job with <br className="hidden md:block" />
            <span className="gradient-text drop-shadow-[0_0_30px_rgba(249,115,22,0.4)]">CareerMate.</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-orange-100/70 mb-12 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg">
            A comprehensive, 100% private, AI-powered platform to build, analyze, and practice for your next big career move.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
            <Link 
              to="/analyzer"
              className="btn-3d px-10 py-5 rounded-2xl text-lg font-bold w-full sm:w-auto flex items-center justify-center gap-3"
            >
              Start Analyzing <ArrowRight size={22} />
            </Link>
            <Link 
              to="/builder"
              className="glass-card-3d backdrop-blur-2xl px-10 py-5 rounded-2xl text-lg font-bold text-white hover:text-orange-300 border-white/20 w-full sm:w-auto transition-colors shadow-[0_0_30px_rgba(255,255,255,0.05)]"
            >
              Build Resume
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Expanding HTML CSS Card Animation (mdjamin style) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">The Complete Suite</h2>
            <p className="text-orange-200/60">Hover over the cards to explore features.</p>
          </div>
          
          {/* Accordion Flex Container */}
          <div className="flex flex-col lg:flex-row h-auto lg:h-[400px] gap-4 w-full">
            
            {/* Feature 1 */}
            <Link to="/analyzer" className="border border-white/20 p-6 rounded-[2rem] overflow-hidden flex-1 lg:hover:flex-[2.5] transition-all duration-500 ease-out flex flex-col justify-end relative group shadow-lg shadow-orange-500/20 bg-[url('/card-1.png')] bg-cover bg-center bg-black/70 bg-blend-overlay hover:bg-black/40">
              <div className="absolute top-6 left-6 w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-lg">
                <FileText className="text-white" size={24} />
              </div>
              <div className="relative z-10 mt-20 lg:mt-0">
                <h3 className="text-2xl font-bold text-white mb-2 whitespace-nowrap">ATS Analyzer</h3>
                <p className="text-orange-100/70 leading-relaxed text-sm opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  Instantly score your resume against real job descriptions using Deep Semantic AI. Find exactly what skills you're missing.
                </p>
              </div>
            </Link>

            {/* Feature 2 */}
            <Link to="/builder" className="border border-white/20 p-6 rounded-[2rem] overflow-hidden flex-1 lg:hover:flex-[2.5] transition-all duration-500 ease-out flex flex-col justify-end relative group shadow-lg shadow-rose-500/20 bg-[url('/card-2.png')] bg-cover bg-center bg-black/70 bg-blend-overlay hover:bg-black/40">
              <div className="absolute top-6 left-6 w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg">
                <LayoutTemplate className="text-white" size={24} />
              </div>
              <div className="relative z-10 mt-20 lg:mt-0">
                <h3 className="text-2xl font-bold text-white mb-2 whitespace-nowrap">ResuMate Builder</h3>
                <p className="text-orange-100/70 leading-relaxed text-sm opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  A visually stunning resume builder that uses AI to generate highly-tailored, STAR-method bullet points for you.
                </p>
              </div>
            </Link>

            {/* Feature 3 */}
            <Link to="/copilot" className="border border-white/20 p-6 rounded-[2rem] overflow-hidden flex-1 lg:hover:flex-[2.5] transition-all duration-500 ease-out flex flex-col justify-end relative group shadow-lg shadow-amber-500/20 bg-[url('/card-3.png')] bg-cover bg-center bg-black/70 bg-blend-overlay hover:bg-black/40">
              <div className="absolute top-6 left-6 w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                <MessageSquare className="text-white" size={24} />
              </div>
              <div className="relative z-10 mt-20 lg:mt-0">
                <h3 className="text-2xl font-bold text-white mb-2 whitespace-nowrap">Interview Copilot</h3>
                <p className="text-orange-100/70 leading-relaxed text-sm opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  Practice real technical and behavioral interviews with an AI agent. Includes voice-typing and instant feedback.
                </p>
              </div>
            </Link>

            {/* Feature 4 */}
            <Link to="/rag" className="border border-white/20 p-6 rounded-[2rem] overflow-hidden flex-1 lg:hover:flex-[2.5] transition-all duration-500 ease-out flex flex-col justify-end relative group shadow-lg shadow-red-500/20 bg-[url('/card-4.png')] bg-cover bg-center bg-black/70 bg-blend-overlay hover:bg-black/40">
              <div className="absolute top-6 left-6 w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg">
                <Database className="text-white" size={24} />
              </div>
              <div className="relative z-10 mt-20 lg:mt-0">
                <h3 className="text-2xl font-bold text-white mb-2 whitespace-nowrap">Career Vault</h3>
                <p className="text-orange-100/70 leading-relaxed text-sm opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  Upload past performance reviews, old resumes, and project docs. Chat with your vault to instantly recall metrics and achievements for interviews!
                </p>
              </div>
            </Link>

          </div>
        </ScrollReveal>
      </section>

      {/* Info Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <ScrollReveal>
          <div className="glass-card-3d backdrop-blur-3xl rounded-[40px] p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 border border-white/20 shadow-2xl">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why CareerMate?</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="shrink-0 mt-1"><Shield className="text-emerald-400" size={24} /></div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Enterprise-Grade Security</h4>
                    <p className="text-sm text-orange-100/60">Your personal data, documents, and Career Vault metrics are processed locally with strict zero-retention policies.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 mt-1"><Zap className="text-amber-400" size={24} /></div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Lightning Fast</h4>
                    <p className="text-sm text-orange-100/60">Optimized for ultimate performance, delivering instant AI feedback and real-time generation.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 mt-1"><Target className="text-rose-400" size={24} /></div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Highly Accurate</h4>
                    <p className="text-sm text-orange-100/60">Utilizes deep semantic analysis instead of simple keyword matching.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full relative min-h-[400px] flex items-center justify-center">
              {/* 3D Wireframe Globe Animation Background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none opacity-60 mix-blend-screen z-0 perspective-1000">
                <div className="absolute inset-0 rounded-full border-[2px] border-orange-500/40 animate-[spin_10s_linear_infinite]" style={{ transform: 'rotateX(60deg)' }}></div>
                <div className="absolute inset-0 rounded-full border-[2px] border-rose-500/40 animate-[spin_15s_linear_infinite_reverse]" style={{ transform: 'rotateX(60deg) rotateY(45deg)' }}></div>
                <div className="absolute inset-0 rounded-full border-[2px] border-amber-500/40 animate-[spin_12s_linear_infinite]" style={{ transform: 'rotateX(60deg) rotateY(-45deg)' }}></div>
                <div className="absolute inset-0 rounded-full border-[2px] border-orange-400/30 animate-[spin_20s_linear_infinite]" style={{ transform: 'rotateX(90deg)' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br from-orange-500/20 to-rose-500/20 rounded-full blur-2xl animate-pulse-glow"></div>
              </div>

              <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                 <img 
                   src="/3d-resume.png" 
                   alt="3D Floating Resume Illustration" 
                   className="w-full h-auto max-w-sm drop-shadow-[0_20px_50px_rgba(234,88,12,0.8)] animate-float relative z-10"
                 />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
