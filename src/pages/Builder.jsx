import { useState, useRef } from 'react';
import { Download, Sparkles, LayoutTemplate, Palette, Briefcase, Plus, Trash2, ChevronDown, ChevronUp, Save, Upload } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const COLORS = [
  { name: 'Slate', value: 'text-slate-800', bg: 'bg-slate-800', border: 'border-slate-800' },
  { name: 'Orange', value: 'text-orange-700', bg: 'bg-orange-700', border: 'border-orange-700' },
  { name: 'Blue', value: 'text-blue-700', bg: 'bg-blue-700', border: 'border-blue-700' },
  { name: 'Emerald', value: 'text-emerald-700', bg: 'bg-emerald-700', border: 'border-emerald-700' },
  { name: 'Rose', value: 'text-rose-700', bg: 'bg-rose-700', border: 'border-rose-700' },
];

export default function Builder() {
  const [data, setData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    github: 'github.com/johndoe',
    linkedin: 'linkedin.com/in/johndoe',
    education: [
      { id: 1, school: 'Stanford University', degree: 'B.S. Computer Science', location: 'Stanford, CA', date: '2019 - 2023' }
    ],
    experience: [
      { 
        id: 1, 
        role: 'Software Engineer Intern', 
        company: 'Google',
        location: 'Mountain View, CA',
        date: 'May 2022 - Aug 2022',
        bullets: [
          'Developed and optimized backend microservices using Node.js and Express.',
          'Reduced API response times by 15% through efficient database querying.'
        ] 
      }
    ],
    projects: [
      { 
        id: 1, 
        name: 'CareerMate Platform', 
        tech: 'React, Vite, Neural AI', 
        bullets: [
          'Built a modern, AI-powered career preparation platform.',
          'Implemented a 3D Glassmorphic UI with advanced CSS animations.'
        ] 
      }
    ],
    achievements: [
      '1st Place at Global Hackathon 2022.',
      'Published paper on Neural Networks in IEEE.'
    ],
    skills: [
      { id: 1, category: 'Languages', items: 'JavaScript, TypeScript, Python, C++' },
      { id: 2, category: 'Frameworks', items: 'React, Next.js, Node.js, Express' }
    ],
    activities: [
      'President of the University Computer Science Club.',
      'Active Open Source Contributor.'
    ]
  });

  const [jobDescription, setJobDescription] = useState('');
  const [activeTemplate, setActiveTemplate] = useState('academic');
  const [activeColor, setActiveColor] = useState(COLORS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  
  // Collapse states for Editor
  const [expanded, setExpanded] = useState({ basic: true, socials: false, education: false, experience: false, projects: false, achievements: false, skills: false, activities: false });

  const toggleExpand = (sec) => setExpanded(p => ({ ...p, [sec]: !p[sec] }));

  const apiKey = import.meta.env.VITE_NEURAL_API_KEY;

  const handlePrint = () => {
    const element = document.getElementById('resume-content');
    
    const opt = {
      margin:       0,
      filename:     `${data.name.replace(/\s+/g, '_')}_CareerMate_Resume.pdf`,
      image:        { type: 'jpeg', quality: 1.0 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  const handleSaveData = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.name.replace(/\s+/g, '_')}_CareerMate_Data.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if(parsed.name) setData(parsed);
      } catch (err) {
        setError("Invalid resume data file");
      }
    };
    reader.readAsText(file);
    e.target.value = null; // reset input
  };

  const handleGenerateBullet = async (collectionType, itemId, bulletIndex) => {
    if (!apiKey) { setError('Gemini API Key missing in .env configuration.'); return; }
    setError(''); setIsGenerating(true);
    try {
      const item = data[collectionType].find(p => p.id === itemId);
      const currentBullet = item.bullets[bulletIndex];
      const prompt = `Rewrite this resume bullet point to be highly impressive and metric-driven (using the STAR method). Target Job Description: "${jobDescription}". Current bullet: "${currentBullet}". ONLY output the rewritten bullet point text, nothing else.`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: "You are an expert ATS Resume Writer." }] },
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        })
      });
      const json = await response.json();
      if (json.error) throw new Error(json.error.message);
      const newText = json.candidates[0].content.parts[0].text.replace(/^[*-]\s*/, '').trim();

      setData(prev => {
        const newCollection = prev[collectionType].map(p => {
          if (p.id === itemId) {
            const newBullets = [...p.bullets];
            newBullets[bulletIndex] = newText;
            return { ...p, bullets: newBullets };
          }
          return p;
        });
        return { ...prev, [collectionType]: newCollection };
      });
    } catch (err) {
      setError(err.message || "Failed to generate.");
    } finally {
      setIsGenerating(false);
    }
  };

  // --- TEMPLATES ---
  
  const AcademicTemplate = () => (
    <div className="w-full h-full bg-white text-black p-10 font-serif text-[11px] leading-relaxed">
      {/* Header */}
      <div className="mb-4">
        <div className="flex justify-between items-end mb-1">
          <h1 className="text-2xl font-bold">{data.name}</h1>
          <div className="text-right">
            <div>Email: {data.email}</div>
            <div>Mobile: {data.phone}</div>
          </div>
        </div>
        <div className="flex justify-between">
          <div>Github: {data.github}</div>
          <div>LinkedIn: {data.linkedin}</div>
        </div>
      </div>

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[13px] font-bold uppercase tracking-wider border-b border-black mb-2 pb-0.5" style={{ fontVariant: 'small-caps' }}>Education</h2>
          {data.education.map(edu => (
            <div key={edu.id} className="mb-2 relative pl-3">
              <span className="absolute left-0 top-0 text-[10px]">•</span>
              <div className="flex justify-between font-bold">
                <span>{edu.school}</span>
                <span className="font-normal">{edu.location}</span>
              </div>
              <div className="flex justify-between italic">
                <span>{edu.degree}</span>
                <span className="not-italic">{edu.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[13px] font-bold uppercase tracking-wider border-b border-black mb-2 pb-0.5" style={{ fontVariant: 'small-caps' }}>Experience</h2>
          {data.experience.map(exp => (
            <div key={exp.id} className="mb-2 relative pl-3">
              <span className="absolute left-0 top-0 text-[10px]">•</span>
              <div className="flex justify-between font-bold">
                <span>{exp.company}</span>
                <span className="font-normal">{exp.location}</span>
              </div>
              <div className="flex justify-between italic mb-1">
                <span>{exp.role}</span>
                <span className="not-italic">{exp.date}</span>
              </div>
              {exp.bullets.map((b, i) => (
                <div key={i} className="relative pl-4 mb-0.5">
                  <span className="absolute left-0 top-0 text-[9px]">◦</span>
                  {b}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[13px] font-bold uppercase tracking-wider border-b border-black mb-2 pb-0.5" style={{ fontVariant: 'small-caps' }}>Projects</h2>
          {data.projects.map(proj => (
            <div key={proj.id} className="mb-2 relative pl-3">
              <span className="absolute left-0 top-0 text-[10px]">•</span>
              <div className="font-bold">{proj.name}</div>
              <div className="italic mb-1">Tech Stack: {proj.tech}</div>
              {proj.bullets.map((b, i) => (
                <div key={i} className="relative pl-4 mb-0.5">
                  <span className="absolute left-0 top-0 text-[9px]">◦</span>
                  {b}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {data.achievements.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[13px] font-bold uppercase tracking-wider border-b border-black mb-2 pb-0.5" style={{ fontVariant: 'small-caps' }}>Achievements</h2>
          {data.achievements.map((ach, i) => (
            <div key={i} className="relative pl-3 mb-0.5">
              <span className="absolute left-0 top-0 text-[10px]">•</span>
              {ach}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[13px] font-bold uppercase tracking-wider border-b border-black mb-2 pb-0.5" style={{ fontVariant: 'small-caps' }}>Skills</h2>
          {data.skills.map(sk => (
            <div key={sk.id} className="relative pl-3 mb-0.5">
              <span className="absolute left-0 top-0 text-[10px]">•</span>
              <span className="font-bold">{sk.category}:</span> {sk.items}
            </div>
          ))}
        </div>
      )}

      {/* Activities */}
      {data.activities.length > 0 && (
        <div>
          <h2 className="text-[13px] font-bold uppercase tracking-wider border-b border-black mb-2 pb-0.5" style={{ fontVariant: 'small-caps' }}>Hobbies & Activities</h2>
          {data.activities.map((act, i) => (
            <div key={i} className="relative pl-3 mb-0.5">
              <span className="absolute left-0 top-0 text-[10px]">•</span>
              {act}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const ModernTemplate = () => (
    <div className="w-full h-full bg-white text-slate-800 p-10 font-sans text-xs leading-relaxed">
      <div className={`border-b-4 ${activeColor.border} pb-6 mb-6 text-center`}>
        <h1 className={`text-4xl font-black mb-2 ${activeColor.value}`}>{data.name}</h1>
        <div className="text-slate-500 font-medium space-x-4">
          <span>{data.email}</span> • <span>{data.phone}</span> • <span>{data.linkedin}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          {data.experience.length > 0 && (
            <div className="mb-6">
              <h2 className={`text-lg font-bold mb-3 ${activeColor.value}`}>EXPERIENCE</h2>
              {data.experience.map(p => (
                <div key={p.id} className="mb-4">
                  <h3 className="font-bold text-sm">{p.role}</h3>
                  <p className="text-slate-500 font-semibold mb-2 text-[10px]">{p.company} | {p.date}</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {p.bullets.map((b,i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {data.projects.length > 0 && (
            <div className="mb-6">
              <h2 className={`text-lg font-bold mb-3 ${activeColor.value}`}>PROJECTS</h2>
              {data.projects.map(p => (
                <div key={p.id} className="mb-4">
                  <h3 className="font-bold text-sm">{p.name}</h3>
                  <p className="text-slate-500 italic mb-2 text-[10px]">{p.tech}</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {p.bullets.map((b,i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="col-span-1 space-y-6">
          {data.education.length > 0 && (
            <div>
              <h2 className={`text-lg font-bold mb-3 ${activeColor.value}`}>EDUCATION</h2>
              {data.education.map(e => (
                <div key={e.id} className="mb-3">
                  <h3 className="font-bold">{e.school}</h3>
                  <p className="text-slate-600">{e.degree}</p>
                  <p className="text-slate-400 text-[10px]">{e.date}</p>
                </div>
              ))}
            </div>
          )}
          {data.skills.length > 0 && (
            <div>
              <h2 className={`text-lg font-bold mb-3 ${activeColor.value}`}>SKILLS</h2>
              {data.skills.map(s => (
                <div key={s.id} className="mb-2">
                  <h3 className="font-bold text-[10px] uppercase">{s.category}</h3>
                  <p className="text-slate-600">{s.items}</p>
                </div>
              ))}
            </div>
          )}
          {data.activities.length > 0 && (
            <div>
              <h2 className={`text-lg font-bold mb-3 ${activeColor.value}`}>ACTIVITIES</h2>
              <ul className="list-disc pl-3 text-slate-600">
                {data.activities.map((a,i) => <li key={i} className="mb-1">{a}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const MinimalistTemplate = () => (
    <div className="w-full h-full bg-white text-slate-800 p-12 font-sans text-[11px] leading-relaxed flex flex-col gap-6">
      <div className="mb-4">
        <h1 className="text-3xl font-light tracking-tight mb-2">{data.name}</h1>
        <div className={`text-xs space-x-3 ${activeColor.value}`}>
          <span>{data.email}</span> | <span>{data.phone}</span> | <span>{data.github}</span> | <span>{data.linkedin}</span>
        </div>
      </div>

      {data.experience.length > 0 && (
        <div>
          <h2 className={`text-sm font-semibold tracking-widest uppercase mb-4 ${activeColor.value}`}>Experience</h2>
          {data.experience.map(exp => (
            <div key={exp.id} className="mb-4 flex gap-6">
              <div className="w-1/4 shrink-0 text-slate-500 font-medium">{exp.date}</div>
              <div className="w-3/4">
                <h3 className="font-bold text-slate-900">{exp.role}</h3>
                <p className="text-slate-500 mb-2">{exp.company}, {exp.location}</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  {exp.bullets.map((b,i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {data.projects.length > 0 && (
        <div>
          <h2 className={`text-sm font-semibold tracking-widest uppercase mb-4 ${activeColor.value}`}>Projects</h2>
          {data.projects.map(proj => (
            <div key={proj.id} className="mb-4 flex gap-6">
              <div className="w-1/4 shrink-0 text-slate-500 font-medium">Project</div>
              <div className="w-3/4">
                <h3 className="font-bold text-slate-900">{proj.name}</h3>
                <p className="text-slate-500 italic mb-2">{proj.tech}</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  {proj.bullets.map((b,i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {data.education.length > 0 && (
        <div>
          <h2 className={`text-sm font-semibold tracking-widest uppercase mb-4 ${activeColor.value}`}>Education</h2>
          {data.education.map(edu => (
            <div key={edu.id} className="mb-3 flex gap-6">
              <div className="w-1/4 shrink-0 text-slate-500 font-medium">{edu.date}</div>
              <div className="w-3/4">
                <h3 className="font-bold text-slate-900">{edu.school}</h3>
                <p className="text-slate-600">{edu.degree}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const CreativeTemplate = () => (
    <div className="w-full h-full bg-white text-slate-800 font-sans text-xs leading-relaxed flex">
      {/* Sidebar */}
      <div className={`w-1/3 ${activeColor.bg} text-white p-8 space-y-8 flex flex-col`}>
        <div>
          <h1 className="text-3xl font-black mb-2 leading-tight">{data.name}</h1>
        </div>
        
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-3 border-b border-white/20 pb-1">Contact</h2>
          <div className="space-y-2 text-[10px] text-white/80">
            <p>{data.email}</p>
            <p>{data.phone}</p>
            <p>{data.github}</p>
            <p>{data.linkedin}</p>
          </div>
        </div>

        {data.skills.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 border-b border-white/20 pb-1">Skills</h2>
            <div className="space-y-3 text-[10px]">
              {data.skills.map(sk => (
                <div key={sk.id}>
                  <p className="font-bold text-white mb-1">{sk.category}</p>
                  <p className="text-white/80 leading-relaxed">{sk.items}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.activities.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 border-b border-white/20 pb-1">Activities</h2>
            <ul className="space-y-2 text-[10px] text-white/80 list-disc pl-3">
              {data.activities.map((a,i) => <li key={i}>{a}</li>)}
            </ul>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-8 bg-slate-50">
        
        {data.experience.length > 0 && (
          <div className="mb-8">
            <h2 className={`text-xl font-bold uppercase tracking-widest mb-4 ${activeColor.value}`}>Experience</h2>
            {data.experience.map(exp => (
              <div key={exp.id} className="mb-5 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">{exp.role}</h3>
                <p className={`font-semibold mb-2 text-[10px] ${activeColor.value}`}>{exp.company} | {exp.date}</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                  {exp.bullets.map((b,i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}

        {data.projects.length > 0 && (
          <div className="mb-8">
            <h2 className={`text-xl font-bold uppercase tracking-widest mb-4 ${activeColor.value}`}>Projects</h2>
            {data.projects.map(proj => (
              <div key={proj.id} className="mb-5 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">{proj.name}</h3>
                <p className="italic text-slate-400 mb-2 text-[10px]">{proj.tech}</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                  {proj.bullets.map((b,i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}

        {data.education.length > 0 && (
          <div className="mb-8">
            <h2 className={`text-xl font-bold uppercase tracking-widest mb-4 ${activeColor.value}`}>Education</h2>
            {data.education.map(edu => (
              <div key={edu.id} className="mb-4">
                <h3 className="font-bold text-slate-900">{edu.school}</h3>
                <p className="text-slate-600 font-medium text-[11px]">{edu.degree}</p>
                <p className="text-slate-400 text-[10px]">{edu.date}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 animate-fade-in-up">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #resume-preview, #resume-preview * { visibility: visible; }
          #resume-preview { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; box-shadow: none; border: none; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="text-center mb-8 no-print">
        <h2 className="text-3xl font-bold mb-2 text-white">
          CareerMate <span className="gradient-text">Builder</span>
        </h2>
        <p className="text-orange-100/60">
          Build structured, ATS-optimized resumes tailored to specific job descriptions using AI.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT: Editor */}
        <div className="w-full lg:w-[50%] xl:w-[40%] space-y-4 no-print h-max lg:sticky lg:top-24 overflow-y-auto max-h-[85vh] pr-2 scrollbar-hide">
          
          {/* Toolbar */}
          <div className="glass-card-3d rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 border border-orange-500/20 z-10 sticky top-0 bg-[#1a0f0a]/90 backdrop-blur-xl">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <LayoutTemplate size={18} className="text-orange-400" />
              <select 
                value={activeTemplate} 
                onChange={e => setActiveTemplate(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm outline-none focus:border-orange-500/50 text-white w-full"
              >
                <option value="academic" className="bg-black">Academic (LaTeX)</option>
                <option value="modern" className="bg-black">Modern (2-Col)</option>
                <option value="minimalist" className="bg-black">Minimalist (Clean)</option>
                <option value="creative" className="bg-black">Creative (Designer)</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <label className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold cursor-pointer transition-colors shadow-lg">
                <Upload size={14} /> Load
                <input type="file" accept=".json" onChange={handleLoadData} className="hidden" />
              </label>
              
              <button onClick={handleSaveData} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-colors shadow-lg">
                <Save size={14} /> Save
              </button>

              <div className="w-px h-6 bg-white/20 mx-1 hidden sm:block"></div>

              <div className="flex gap-1 bg-white/5 p-1 rounded-full border border-white/10 hidden sm:flex">
                {COLORS.map(c => (
                  <button 
                    key={c.name} onClick={() => setActiveColor(c)}
                    className={`w-5 h-5 rounded-full border-2 transition-all ${c.bg} ${activeColor.name === c.name ? 'border-white scale-110' : 'border-transparent'}`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
            
            <button onClick={handlePrint} className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-lg shadow-orange-500/20 shrink-0 ml-2">
              <Download size={16} /> PDF
            </button>
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-2 rounded-xl">{error}</div>}

          {/* Job Description Target */}
          <div className="glass-card-3d rounded-2xl p-5 border border-orange-500/20">
            <h3 className="font-bold text-sm mb-2 flex items-center gap-2 text-orange-300">
              <Briefcase size={16} /> Target Job Description (Optional)
            </h3>
            <textarea 
              value={jobDescription} onChange={e => setJobDescription(e.target.value)} 
              placeholder="Paste job description here to heavily tailor AI suggestions..."
              rows={2} className="w-full bg-black/20 border border-orange-500/20 rounded-lg px-3 py-2 text-sm focus:border-orange-500 outline-none resize-none placeholder-slate-600 text-slate-200" 
            />
          </div>

          {/* Form Sections */}
          <div className="space-y-3">
            
            {/* Basic Info */}
            <div className="glass-card-3d rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-4 bg-white/5 cursor-pointer flex justify-between items-center hover:bg-white/10 transition" onClick={() => toggleExpand('basic')}>
                <h3 className="font-bold text-sm text-white">Basic Information</h3>
                {expanded.basic ? <ChevronUp size={16} className="text-slate-400"/> : <ChevronDown size={16} className="text-slate-400"/>}
              </div>
              {expanded.basic && (
                <div className="p-4 grid grid-cols-2 gap-3 bg-black/20">
                  <input placeholder="Full Name" value={data.name} onChange={e => setData({...data, name: e.target.value})} className="col-span-2 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none text-white focus:border-orange-500" />
                  <input placeholder="Email" value={data.email} onChange={e => setData({...data, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none text-white focus:border-orange-500" />
                  <input placeholder="Phone" value={data.phone} onChange={e => setData({...data, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none text-white focus:border-orange-500" />
                </div>
              )}
            </div>

            {/* Social Profiles */}
            <div className="glass-card-3d rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-4 bg-white/5 cursor-pointer flex justify-between items-center hover:bg-white/10 transition" onClick={() => toggleExpand('socials')}>
                <h3 className="font-bold text-sm text-white">Social Profiles</h3>
                {expanded.socials ? <ChevronUp size={16} className="text-slate-400"/> : <ChevronDown size={16} className="text-slate-400"/>}
              </div>
              {expanded.socials && (
                <div className="p-4 grid grid-cols-1 gap-3 bg-black/20">
                  <input placeholder="Github URL" value={data.github} onChange={e => setData({...data, github: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none text-white focus:border-orange-500" />
                  <input placeholder="LinkedIn URL" value={data.linkedin} onChange={e => setData({...data, linkedin: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none text-white focus:border-orange-500" />
                </div>
              )}
            </div>

            {/* Education */}
            <div className="glass-card-3d rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-4 bg-white/5 cursor-pointer flex justify-between items-center hover:bg-white/10 transition" onClick={() => toggleExpand('education')}>
                <h3 className="font-bold text-sm text-white">Education ({data.education.length})</h3>
                {expanded.education ? <ChevronUp size={16} className="text-slate-400"/> : <ChevronDown size={16} className="text-slate-400"/>}
              </div>
              {expanded.education && (
                <div className="p-4 bg-black/20 space-y-4">
                  {data.education.map((edu, idx) => (
                    <div key={edu.id} className="relative bg-white/5 p-3 rounded-xl border border-white/10">
                      <button onClick={() => setData(d => ({...d, education: d.education.filter(e => e.id !== edu.id)}))} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 size={14}/></button>
                      <input placeholder="School/University" value={edu.school} onChange={e => { const newEdu = [...data.education]; newEdu[idx].school = e.target.value; setData({...data, education: newEdu})}} className="w-full bg-transparent border-b border-white/10 px-1 py-1 text-sm outline-none text-white focus:border-orange-500 mb-2 font-bold" />
                      <input placeholder="Degree & Details" value={edu.degree} onChange={e => { const newEdu = [...data.education]; newEdu[idx].degree = e.target.value; setData({...data, education: newEdu})}} className="w-full bg-transparent border-b border-white/10 px-1 py-1 text-sm outline-none text-white focus:border-orange-500 mb-2 italic" />
                      <div className="grid grid-cols-2 gap-2">
                        <input placeholder="Location" value={edu.location} onChange={e => { const newEdu = [...data.education]; newEdu[idx].location = e.target.value; setData({...data, education: newEdu})}} className="w-full bg-transparent border-b border-white/10 px-1 py-1 text-sm outline-none text-white focus:border-orange-500" />
                        <input placeholder="Date" value={edu.date} onChange={e => { const newEdu = [...data.education]; newEdu[idx].date = e.target.value; setData({...data, education: newEdu})}} className="w-full bg-transparent border-b border-white/10 px-1 py-1 text-sm outline-none text-white focus:border-orange-500" />
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setData(d => ({...d, education: [...d.education, { id: Date.now(), school: '', degree: '', location: '', date: '' }] }))} className="w-full py-2 border border-dashed border-orange-500/40 rounded-xl text-orange-400 text-sm font-semibold flex justify-center items-center gap-1 hover:bg-orange-500/10">
                    <Plus size={16}/> Add Education
                  </button>
                </div>
              )}
            </div>

            {/* Experience */}
            <div className="glass-card-3d rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-4 bg-white/5 cursor-pointer flex justify-between items-center hover:bg-white/10 transition" onClick={() => toggleExpand('experience')}>
                <h3 className="font-bold text-sm text-white">Experience ({data.experience.length})</h3>
                {expanded.experience ? <ChevronUp size={16} className="text-slate-400"/> : <ChevronDown size={16} className="text-slate-400"/>}
              </div>
              {expanded.experience && (
                <div className="p-4 bg-black/20 space-y-4">
                  {data.experience.map((exp, idx) => (
                    <div key={exp.id} className="relative bg-white/5 p-3 rounded-xl border border-white/10">
                      <button onClick={() => setData(d => ({...d, experience: d.experience.filter(p => p.id !== exp.id)}))} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 size={14}/></button>
                      <input placeholder="Company Name" value={exp.company} onChange={e => { const newExp = [...data.experience]; newExp[idx].company = e.target.value; setData({...data, experience: newExp})}} className="w-full bg-transparent border-b border-white/10 px-1 py-1 text-sm outline-none text-white focus:border-orange-500 mb-2 font-bold" />
                      <input placeholder="Role Title" value={exp.role} onChange={e => { const newExp = [...data.experience]; newExp[idx].role = e.target.value; setData({...data, experience: newExp})}} className="w-full bg-transparent border-b border-white/10 px-1 py-1 text-[13px] outline-none text-slate-200 focus:border-orange-500 mb-2 italic" />
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <input placeholder="Location" value={exp.location} onChange={e => { const newExp = [...data.experience]; newExp[idx].location = e.target.value; setData({...data, experience: newExp})}} className="w-full bg-transparent border-b border-white/10 px-1 py-1 text-sm outline-none text-white focus:border-orange-500" />
                        <input placeholder="Date" value={exp.date} onChange={e => { const newExp = [...data.experience]; newExp[idx].date = e.target.value; setData({...data, experience: newExp})}} className="w-full bg-transparent border-b border-white/10 px-1 py-1 text-sm outline-none text-white focus:border-orange-500" />
                      </div>
                      
                      <div className="space-y-2 mt-2">
                        <label className="text-[10px] uppercase text-slate-400 font-bold">Bullet Points</label>
                        {exp.bullets.map((b, bIdx) => (
                          <div key={bIdx} className="flex gap-2">
                            <textarea value={b} onChange={e => { const newExp = [...data.experience]; newExp[idx].bullets[bIdx] = e.target.value; setData({...data, experience: newExp})}} rows={2} className="w-full bg-black/30 border border-white/10 rounded-lg px-2 py-1.5 text-xs outline-none text-white focus:border-orange-500 resize-none" />
                            <div className="flex flex-col gap-1">
                              <button onClick={() => handleGenerateBullet('experience', exp.id, bIdx)} title="AI Enhance Bullet" className="p-1.5 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded border border-amber-500/20"><Sparkles size={12}/></button>
                              <button onClick={() => { const newExp = [...data.experience]; newExp[idx].bullets.splice(bIdx, 1); setData({...data, experience: newExp})}} title="Remove Bullet" className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded border border-red-500/20"><Trash2 size={12}/></button>
                            </div>
                          </div>
                        ))}
                        <button onClick={() => { const newExp = [...data.experience]; newExp[idx].bullets.push(''); setData({...data, experience: newExp})}} className="text-xs text-orange-400 font-semibold hover:text-orange-300 flex items-center gap-1 mt-1"><Plus size={12}/> Add Bullet</button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setData(d => ({...d, experience: [...d.experience, { id: Date.now(), role: '', company: '', location: '', date: '', bullets: [''] }] }))} className="w-full py-2 border border-dashed border-orange-500/40 rounded-xl text-orange-400 text-sm font-semibold flex justify-center items-center gap-1 hover:bg-orange-500/10">
                    <Plus size={16}/> Add Experience
                  </button>
                </div>
              )}
            </div>

            {/* Projects */}
            <div className="glass-card-3d rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-4 bg-white/5 cursor-pointer flex justify-between items-center hover:bg-white/10 transition" onClick={() => toggleExpand('projects')}>
                <h3 className="font-bold text-sm text-white">Projects ({data.projects.length})</h3>
                {expanded.projects ? <ChevronUp size={16} className="text-slate-400"/> : <ChevronDown size={16} className="text-slate-400"/>}
              </div>
              {expanded.projects && (
                <div className="p-4 bg-black/20 space-y-4">
                  {data.projects.map((proj, idx) => (
                    <div key={proj.id} className="relative bg-white/5 p-3 rounded-xl border border-white/10">
                      <button onClick={() => setData(d => ({...d, projects: d.projects.filter(p => p.id !== proj.id)}))} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 size={14}/></button>
                      <input placeholder="Project Name" value={proj.name} onChange={e => { const newProj = [...data.projects]; newProj[idx].name = e.target.value; setData({...data, projects: newProj})}} className="w-full bg-transparent border-b border-white/10 px-1 py-1 text-sm outline-none text-white focus:border-orange-500 mb-2 font-bold" />
                      <input placeholder="Tech Stack" value={proj.tech} onChange={e => { const newProj = [...data.projects]; newProj[idx].tech = e.target.value; setData({...data, projects: newProj})}} className="w-full bg-transparent border-b border-white/10 px-1 py-1 text-[11px] outline-none text-slate-300 focus:border-orange-500 mb-2 italic" />
                      
                      <div className="space-y-2 mt-2">
                        <label className="text-[10px] uppercase text-slate-400 font-bold">Bullet Points</label>
                        {proj.bullets.map((b, bIdx) => (
                          <div key={bIdx} className="flex gap-2">
                            <textarea value={b} onChange={e => { const newProj = [...data.projects]; newProj[idx].bullets[bIdx] = e.target.value; setData({...data, projects: newProj})}} rows={2} className="w-full bg-black/30 border border-white/10 rounded-lg px-2 py-1.5 text-xs outline-none text-white focus:border-orange-500 resize-none" />
                            <div className="flex flex-col gap-1">
                              <button onClick={() => handleGenerateBullet('projects', proj.id, bIdx)} title="AI Enhance Bullet" className="p-1.5 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded border border-amber-500/20"><Sparkles size={12}/></button>
                              <button onClick={() => { const newProj = [...data.projects]; newProj[idx].bullets.splice(bIdx, 1); setData({...data, projects: newProj})}} title="Remove Bullet" className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded border border-red-500/20"><Trash2 size={12}/></button>
                            </div>
                          </div>
                        ))}
                        <button onClick={() => { const newProj = [...data.projects]; newProj[idx].bullets.push(''); setData({...data, projects: newProj})}} className="text-xs text-orange-400 font-semibold hover:text-orange-300 flex items-center gap-1 mt-1"><Plus size={12}/> Add Bullet</button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setData(d => ({...d, projects: [...d.projects, { id: Date.now(), name: '', tech: '', bullets: [''] }] }))} className="w-full py-2 border border-dashed border-orange-500/40 rounded-xl text-orange-400 text-sm font-semibold flex justify-center items-center gap-1 hover:bg-orange-500/10">
                    <Plus size={16}/> Add Project
                  </button>
                </div>
              )}
            </div>

            {/* Achievements */}
            <div className="glass-card-3d rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-4 bg-white/5 cursor-pointer flex justify-between items-center hover:bg-white/10 transition" onClick={() => toggleExpand('achievements')}>
                <h3 className="font-bold text-sm text-white">Achievements ({data.achievements.length})</h3>
                {expanded.achievements ? <ChevronUp size={16} className="text-slate-400"/> : <ChevronDown size={16} className="text-slate-400"/>}
              </div>
              {expanded.achievements && (
                <div className="p-4 bg-black/20 space-y-2">
                  {data.achievements.map((ach, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input value={ach} onChange={e => { const n = [...data.achievements]; n[idx] = e.target.value; setData({...data, achievements: n})}} className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs outline-none text-white focus:border-orange-500" />
                      <button onClick={() => { const n = [...data.achievements]; n.splice(idx, 1); setData({...data, achievements: n})}} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded"><Trash2 size={14}/></button>
                    </div>
                  ))}
                  <button onClick={() => setData(d => ({...d, achievements: [...d.achievements, '']}))} className="text-xs text-orange-400 font-semibold flex items-center gap-1"><Plus size={12}/> Add Achievement</button>
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="glass-card-3d rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-4 bg-white/5 cursor-pointer flex justify-between items-center hover:bg-white/10 transition" onClick={() => toggleExpand('skills')}>
                <h3 className="font-bold text-sm text-white">Skills ({data.skills.length})</h3>
                {expanded.skills ? <ChevronUp size={16} className="text-slate-400"/> : <ChevronDown size={16} className="text-slate-400"/>}
              </div>
              {expanded.skills && (
                <div className="p-4 bg-black/20 space-y-3">
                  {data.skills.map((sk, idx) => (
                    <div key={sk.id} className="flex gap-2 items-start">
                      <input placeholder="Category" value={sk.category} onChange={e => { const n = [...data.skills]; n[idx].category = e.target.value; setData({...data, skills: n})}} className="w-1/3 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs outline-none text-white font-bold" />
                      <input placeholder="Skills CSV" value={sk.items} onChange={e => { const n = [...data.skills]; n[idx].items = e.target.value; setData({...data, skills: n})}} className="w-2/3 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs outline-none text-white" />
                      <button onClick={() => setData(d => ({...d, skills: d.skills.filter(s => s.id !== sk.id)}))} className="p-1.5 text-red-400"><Trash2 size={14}/></button>
                    </div>
                  ))}
                  <button onClick={() => setData(d => ({...d, skills: [...d.skills, { id: Date.now(), category: '', items: '' }]}))} className="text-xs text-orange-400 font-semibold flex items-center gap-1"><Plus size={12}/> Add Skill Category</button>
                </div>
              )}
            </div>

            {/* Activities */}
            <div className="glass-card-3d rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-4 bg-white/5 cursor-pointer flex justify-between items-center hover:bg-white/10 transition" onClick={() => toggleExpand('activities')}>
                <h3 className="font-bold text-sm text-white">Hobbies & Activities ({data.activities.length})</h3>
                {expanded.activities ? <ChevronUp size={16} className="text-slate-400"/> : <ChevronDown size={16} className="text-slate-400"/>}
              </div>
              {expanded.activities && (
                <div className="p-4 bg-black/20 space-y-2">
                  {data.activities.map((act, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input value={act} onChange={e => { const n = [...data.activities]; n[idx] = e.target.value; setData({...data, activities: n})}} className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs outline-none text-white focus:border-orange-500" />
                      <button onClick={() => { const n = [...data.activities]; n.splice(idx, 1); setData({...data, activities: n})}} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded"><Trash2 size={14}/></button>
                    </div>
                  ))}
                  <button onClick={() => setData(d => ({...d, activities: [...d.activities, '']}))} className="text-xs text-orange-400 font-semibold flex items-center gap-1"><Plus size={12}/> Add Activity / Hobby</button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* RIGHT: Preview (A4 Paper Aspect Ratio) */}
        <div className="w-full lg:w-[50%] xl:w-[60%] flex justify-center lg:justify-start lg:sticky lg:top-24 h-max no-print">
          <div className="origin-top-left lg:scale-75 xl:scale-[0.85] 2xl:scale-100 transition-transform">
            <div 
              id="resume-preview" 
              className="bg-white w-[210mm] min-h-[297mm] shadow-2xl rounded-sm overflow-hidden border border-slate-200"
            >
              <div id="resume-content" className="w-full h-full bg-white">
                {activeTemplate === 'academic' && <AcademicTemplate />}
                {activeTemplate === 'modern' && <ModernTemplate />}
                {activeTemplate === 'minimalist' && <MinimalistTemplate />}
                {activeTemplate === 'creative' && <CreativeTemplate />}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
