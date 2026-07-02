// ATS Resume Analyzer Core Logic
// Powered by Advanced Neural Analysis (Gemini)

export async function analyzeResume(resumeText, jobDescription = '') {
  if (!resumeText || resumeText.trim().length < 20) return null;
  const apiKey = import.meta.env.VITE_NEURAL_API_KEY;
  if (!apiKey) throw new Error("API Key missing");

  const systemInstruction = `You are an expert ATS (Applicant Tracking System) parser and technical recruiter. 
You will be provided with a candidate's resume text, and optionally a target Job Description.
You must perform a deep semantic analysis and return a JSON object exactly matching this schema:
{
  "score": <number 0-100>,
  "scoreLabel": "<string: Excellent, Good, Fair, or Needs Work>",
  "scoreColor": "<string: green, blue, yellow, or red>",
  "found": [
    { "name": "<Skill Name>", "category": "<Category: Language, Web, Framework, Database, Tool, AI/ML, Architecture, or CS Fundamentals>" }
  ],
  "missing": [
    { "name": "<Crucial skill missing for this role>", "category": "<Category>" }
  ],
  "suggestions": [
    { "id": "<unique_id>", "message": "<Actionable advice>", "priority": "<high, medium, or low>" }
  ],
  "bonusFound": ["<string describing a great thing found, e.g., 'GitHub Profile', 'Metrics Used'>"],
  "wordCount": ${resumeText.trim().split(/\s+/).length}
}
Do not return any markdown wrappers like \`\`\`json. Return ONLY raw JSON.`;

  const prompt = `RESUME:
${resumeText}

${jobDescription ? `TARGET JOB DESCRIPTION:\n${jobDescription}` : 'TARGET ROLE: General Software Engineering/Tech Role'}
`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemInstruction }] },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        response_mime_type: "application/json"
      }
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);

  try {
    const analysisStr = data.candidates[0].content.parts[0].text;
    const analysis = JSON.parse(analysisStr);
    return analysis;
  } catch (e) {
    console.error("Failed to parse JSON", e);
    throw new Error("Failed to parse analysis results.");
  }
}

export const CATEGORY_COLORS = {
  Language:        { bg: 'bg-violet-500/20', text: 'text-violet-300', border: 'border-violet-500/40', dot: 'bg-violet-400' },
  Web:             { bg: 'bg-blue-500/20',   text: 'text-blue-300',   border: 'border-blue-500/40',   dot: 'bg-blue-400' },
  Framework:       { bg: 'bg-cyan-500/20',   text: 'text-cyan-300',   border: 'border-cyan-500/40',   dot: 'bg-cyan-400' },
  Database:        { bg: 'bg-amber-500/20',  text: 'text-amber-300',  border: 'border-amber-500/40',  dot: 'bg-amber-400' },
  Tool:            { bg: 'bg-emerald-500/20',text: 'text-emerald-300',border: 'border-emerald-500/40',dot: 'bg-emerald-400' },
  'AI/ML':         { bg: 'bg-pink-500/20',   text: 'text-pink-300',   border: 'border-pink-500/40',   dot: 'bg-pink-400' },
  Architecture:    { bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/40', dot: 'bg-orange-400' },
  'CS Fundamentals':{ bg: 'bg-indigo-500/20',text: 'text-indigo-300', border: 'border-indigo-500/40', dot: 'bg-indigo-400' },
};

export const PRIORITY_CONFIG = {
  high:   { label: 'High Priority',   icon: '🔴', color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30' },
  medium: { label: 'Medium Priority', icon: '🟡', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  low:    { label: 'Low Priority',    icon: '🟢', color: 'text-emerald-400',bg: 'bg-emerald-500/10',border: 'border-emerald-500/30' },
};
