import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Analyzer from './pages/Analyzer';
import Builder from './pages/Builder';
import InterviewCopilot from './pages/InterviewCopilot';
import RagAssistant from './pages/RagAssistant';
import CustomCursor from './components/CustomCursor';
import { Home as HomeIcon, FileText, LayoutTemplate, MessageSquare, Database } from 'lucide-react';

function Navigation() {
  const location = useLocation();

  const links = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/analyzer', label: 'CareerMate Analyzer', icon: FileText },
    { path: '/builder', label: 'CareerMate Builder', icon: LayoutTemplate },
    { path: '/copilot', label: 'Interview Copilot', icon: MessageSquare },
    { path: '/rag', label: 'Knowledge Base', icon: Database },
  ];

  return (
    <nav className="glass-card mb-8 rounded-2xl p-2 mx-4 sm:mx-6 lg:mx-8 max-w-5xl lg:mx-auto flex overflow-x-auto gap-2 scrollbar-hide">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = location.pathname === link.path;
        return (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              isActive 
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.15)] scale-105' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent hover:scale-105'
            }`}
          >
            <Icon size={18} className={isActive ? 'text-orange-400' : 'text-slate-500'} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen hero-bg flex flex-col cursor-none">
        <CustomCursor />
        <Header />
        
        <div className="pt-24 flex-grow">
          <Navigation />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyzer" element={<Analyzer />} />
            <Route path="/builder" element={<Builder />} />
            <Route path="/copilot" element={<InterviewCopilot />} />
            <Route path="/rag" element={<RagAssistant />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
