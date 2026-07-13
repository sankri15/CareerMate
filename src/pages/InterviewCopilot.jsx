import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, KeyRound, AlertCircle, Mic, Volume2, VolumeX } from 'lucide-react';

export default function InterviewCopilot() {
  const envKey = import.meta.env.VITE_NEURAL_API_KEY;
  const [apiKey, setApiKey] = useState(() => envKey || localStorage.getItem('neural_api_key') || '');
  const [showSettings, setShowSettings] = useState(!envKey && !localStorage.getItem('neural_api_key'));
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am your AI Interview Copilot. Tell me the job role you are interviewing for, and we can begin a practice session.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('neural_api_key', key);
    if (key) setShowSettings(false);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError("Speech recognition is not supported in this browser. Try Chrome or Edge.");
      return;
    }
    
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onstart = () => {
      setIsListening(true);
      setError('');
    };
    
    // We want to accumulate text, not overwrite it, but interim results can be tricky.
    // For simplicity, we just set the input to whatever it hears.
    let finalTranscript = input ? input + ' ' : '';
    
    recognition.onresult = (event) => {
      let interimTranscript = '';
      let newFinal = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          newFinal += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      finalTranscript += newFinal;
      setInput(finalTranscript + interimTranscript);
    };
    
    recognition.onerror = (event) => {
      console.error(event.error);
      setIsListening(false);
      if (event.error !== 'no-speech') {
        setError("Microphone error: " + event.error);
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };

  const generateAIResponse = async (chatHistory) => {
    if (!apiKey) throw new Error("API Key required");

    const contents = chatHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const systemInstruction = "You are an expert technical interviewer. The user will state their role, and you must conduct a professional interview. Ask relevant technical and behavioral questions one at a time. After the user answers, provide brief, constructive feedback on their answer (using the STAR method for behavioral), and then ask the next question. Keep your responses concise and highly relevant to their specific technical field.";

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: contents
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      return data.candidates[0].content.parts[0].text;
    } catch (err) {
      console.error(err);
      throw new Error(err.message || "Failed to fetch response. Check your API key.");
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!apiKey) {
      setError("Failed to connect to Neural Engine. Service temporarily unavailable.");
      setIsTyping(false);
      return;
    }
    
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    
    setError('');
    const userMessage = { role: 'user', content: input };
    const newHistory = [...messages, userMessage];
    
    setMessages(newHistory);
    setInput('');
    setIsTyping(true);
    
    // Smooth scroll down slightly when user sends a message
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);

    try {
      const aiResponseText = await generateAIResponse(newHistory);
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponseText }]);
      
      // Auto-play text-to-speech for the AI response
      if (isAudioEnabled && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop any ongoing speech
        const utterance = new SpeechSynthesisUtterance(aiResponseText);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
      
    } catch (err) {
      setError(err.message);
      setMessages(messages);
      setInput(userMessage.content);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">
          Interview <span className="gradient-text">Copilot</span>
        </h2>
        <p className="text-slate-400">
          Practice your interview skills with real-time, highly intelligent feedback.
        </p>
      </div>

      <div className="glass-card rounded-2xl flex flex-col h-[650px] border border-violet-500/20 overflow-hidden relative">
        
        {/* Audio Toggle */}
        <button 
          onClick={() => {
            setIsAudioEnabled(!isAudioEnabled);
            if (isAudioEnabled && 'speechSynthesis' in window) window.speechSynthesis.cancel();
          }}
          className={`absolute top-4 right-4 z-10 px-3 py-1.5 rounded-lg border flex items-center gap-2 text-xs transition-colors shadow-lg backdrop-blur-sm ${
            isAudioEnabled 
              ? 'bg-violet-500/20 border-violet-500/30 text-violet-300 hover:bg-violet-500/30' 
              : 'bg-black/40 border-white/10 text-slate-400 hover:bg-black/60'
          }`}
          title={isAudioEnabled ? "Disable AI Voice" : "Enable AI Voice"}
        >
          {isAudioEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          {isAudioEnabled ? 'Audio ON' : 'Audio OFF'}
        </button>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-500/20 text-blue-400' : 'bg-violet-500/20 text-violet-400'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-500/10 border border-blue-500/20 text-slate-200' : 'bg-white/5 border border-white/10 text-slate-300'} whitespace-pre-wrap`}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce delay-200" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Box */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs mb-3 px-2 bg-red-500/10 py-2 rounded-lg border border-red-500/20">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
          <div className="flex items-center gap-3">
            <button 
              onClick={startListening}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 border ${
                isListening 
                  ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse' 
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-emerald-400 border-white/5'
              }`}
              title={isListening ? "Stop Listening" : "Start Voice Input"}
            >
              <Mic size={16} />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? "Listening..." : "Type your answer (or role) here..."}
              className={`flex-1 bg-white/5 border rounded-xl px-4 py-2.5 text-sm focus:border-violet-500/50 outline-none text-slate-200 transition-colors ${
                isListening ? 'border-red-500/30 bg-red-500/5' : 'border-white/10'
              }`}
              disabled={isTyping || showSettings}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping || showSettings}
              className="w-10 h-10 rounded-xl bg-violet-500 hover:bg-violet-600 disabled:opacity-50 flex items-center justify-center text-white transition-colors shrink-0"
            >
              <Send size={16} className="ml-1" />
            </button>
          </div>
          <p className="text-center text-xs text-slate-500 mt-2">
            100% Private &middot; No Data Stored.
          </p>
        </div>

      </div>
    </div>
  );
}
