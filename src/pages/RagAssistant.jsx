import { useState, useRef, useEffect } from 'react';
import { Search, UploadCloud, FileText, Database, CornerDownRight, AlertCircle, CheckCircle } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
// Standard Vite import for worker
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function RagAssistant() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const resultsRef = useRef(null);

  const apiKey = import.meta.env.VITE_NEURAL_API_KEY;

  const extractTextFromPdf = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += `--- [Start of Page ${i}] ---\n${pageText}\n--- [End of Page ${i}] ---\n`;
    }
    return fullText;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setError('');
    setIsUploading(true);

    try {
      let extractedText = '';
      if (file.type === 'application/pdf') {
        extractedText = await extractTextFromPdf(file);
      } else if (file.type === 'text/plain' || file.type === 'text/markdown') {
        extractedText = await file.text();
      } else {
        throw new Error("Unsupported file type. Please upload a PDF, TXT, or MD file.");
      }

      setDocuments(prev => [...prev, {
        id: Date.now(),
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        content: extractedText
      }]);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to process document.');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    if (documents.length === 0) {
      setError("Please upload at least one document to search.");
      return;
    }
    if (!apiKey) {
      setError("Gemini API Key is missing from .env configuration.");
      return;
    }

    setError('');
    setIsSearching(true);
    setResults(null);

    // Combine all document texts
    const allDocsText = documents.map(doc => `Document Name: ${doc.name}\nContent:\n${doc.content}`).join('\n\n====================\n\n');

    const systemInstruction = "You are a Career Vault AI. You have been provided with the user's past performance reviews, old resumes, and project documentation. You MUST answer the user's question based strictly on the provided text to help them recall their past metrics and achievements for interviews. Do not invent information. If possible, cite the document name.";
    const userPrompt = `CONTEXT DOCUMENTS:\n${allDocsText}\n\nUSER QUESTION: ${query}`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }]
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      setResults({
        answer: data.candidates[0].content.parts[0].text,
        sources: documents.map(d => d.name) // Basic source tracking for UI
      });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to query the documents.');
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (results && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [results]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">
          Your <span className="gradient-text from-red-500 to-rose-500 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]">Career Vault</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Upload your past performance reviews, old resumes, and project documentation. Chat with your vault to instantly recall forgotten metrics and achievements for your interviews!
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left: Knowledge Base Manager */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
            <div className="flex items-center gap-2 mb-4">
              <Database className="text-red-400" size={20} />
              <h3 className="font-bold text-slate-200 text-lg">Vault Documents</h3>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".pdf,.txt,.md" 
              className="hidden" 
            />

            <div 
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed border-emerald-500/30 rounded-xl p-6 text-center transition-colors mb-6 group ${isUploading ? 'opacity-50 cursor-wait' : 'hover:bg-emerald-500/10 cursor-pointer bg-white/5'}`}
            >
              <UploadCloud className={`mx-auto transition-colors mb-2 ${isUploading ? 'text-emerald-400 animate-bounce' : 'text-slate-400 group-hover:text-emerald-400'}`} size={28} />
              <p className="text-sm font-semibold text-slate-200">
                {isUploading ? 'Parsing Document...' : 'Upload Document'}
              </p>
              <p className="text-xs text-slate-500 mt-1">PDF, TXT, MD</p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                Indexed Documents 
                <span className="bg-white/10 px-2 py-0.5 rounded-full text-[10px]">{documents.length}</span>
              </h4>
              
              {documents.length === 0 ? (
                <div className="text-xs text-slate-500 text-center py-4 bg-black/20 rounded-lg border border-white/5">
                  No documents uploaded yet.
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-hide pr-1">
                  {documents.map(doc => (
                    <div key={doc.id} className="flex items-center gap-3 bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
                      <FileText size={16} className="text-emerald-400 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-200 truncate">{doc.name}</p>
                        <p className="text-xs text-emerald-400/70">{doc.size} &bull; Indexed</p>
                      </div>
                      <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Query Interface */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl p-6 border border-blue-500/20 min-h-[400px] flex flex-col">
            
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm mb-4 px-4 bg-red-500/10 py-3 rounded-xl border border-red-500/20">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Search Bar */}
            <div className="relative mb-8">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={20} className={isSearching ? 'text-blue-400 animate-pulse' : 'text-slate-500'} />
              </div>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Ask your Vault (e.g. 'What were my key metrics at my last job?')..."
                disabled={isSearching}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-24 text-slate-200 placeholder-slate-500 focus:border-red-500/50 outline-none shadow-inner disabled:opacity-50"
              />
              <div className="absolute inset-y-0 right-2 flex items-center">
                <button
                  onClick={handleSearch}
                  disabled={!query.trim() || isSearching || documents.length === 0}
                  className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            {/* Loading State */}
            {isSearching && (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-2 border-slate-700"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                </div>
                <p className="text-sm animate-pulse text-blue-400">Analyzing {documents.length} document(s) via Neural Engine...</p>
              </div>
            )}

            {/* Results Area */}
            {results && !isSearching && (
              <div ref={resultsRef} className="flex-1 flex flex-col gap-6 animate-fade-in-up">
                
                {/* AI Answer */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                  <h4 className="text-sm font-bold text-blue-400 mb-2 flex items-center gap-2">
                    <Database size={16} /> Synthesized Answer
                  </h4>
                  <div className="text-slate-200 leading-relaxed text-sm whitespace-pre-wrap">
                    {results.answer}
                  </div>
                </div>

                {/* Citations / Sources */}
                {results.sources.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Documents Consulted</h4>
                    <div className="flex flex-wrap gap-2">
                      {results.sources.map((src, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300">
                          <CornerDownRight size={12} className="text-emerald-400" />
                          {src}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {!results && !isSearching && (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 opacity-50">
                <Database size={48} className="mb-4 text-red-500/40" />
                <p className="text-sm text-center max-w-sm">
                  Upload your past performance reviews, old resumes, or project docs on the left, then ask questions here to instantly retrieve past metrics and achievements!
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
