import { callGemini } from './geminiService';
import { UserProfile, Opportunity, PlanJSON, PDFJSON, PPTJSON, ExcelJSON, TrainingLesson } from '../types';

// --- Prompts ---

const PROMPTS = {
  generateOpportunities: `
SYSTEM: You are NextWave Mentor, an AI engine that designs locally grounded business opportunities for African youth. Return JSON only.

INJECT: {{userProfile}}

TASK: Produce 3–5 realistic business opportunities executable within 90 days.

RETURN FORMAT:
{
 "opportunities":[
   {
     "id":"",
     "title":"",
     "description":"",
     "why_it_fits":"",
     "starting_capital_band":"",
     "earning_potential_band":"",
     "top_risks":["","",""],
     "example_mvp_steps":["","",""]
   }
 ]
}`,
  generatePlan: `
SYSTEM: You are an execution engine. Return JSON only.

INJECT: {{userProfile}}, {{selectedIdea}}

TASK: Create a 90-day plan (13 weeks) with 3–7 tasks per week.
Each task must include title, detail, estimated_hours, difficulty(1–5), tag.

Format: { "weeks": [ { "weekNumber": 1, "tasks": [...] } ] }
`,
  generateConceptNote: `
SYSTEM: Produce structured JSON optimized for PDF.

TASK:
{
 "pdf_title":"Business Concept Note",
 "sections":[
   {"heading":"Problem Overview","content":"..."},
   {"heading":"Proposed Solution","content":"..."},
   {"heading":"Target Customer","content":"..."},
   {"heading":"Value Proposition","content":"..."},
   {"heading":"Execution Approach","content":"..."},
   {"heading":"Key Metrics","content":"..."},
   {"heading":"Resource Requirements","content":"..."},
   {"heading":"Risks & Mitigation","content":"..."},
   {"heading":"Ask","content":"..."}
 ]
}`,
  generatePitchOutline: `
SYSTEM: Output JSON for a 10-slide pitch deck.

TASK: Return:
{
 "slides":[
   {"title":"Problem","bullets":["",""]},
   {"title":"Solution","bullets":["",""]},
   {"title":"Market Opportunity","bullets":["",""]},
   {"title":"Product / Service","bullets":["",""]},
   {"title":"Business Model","bullets":["",""]},
   {"title":"Go-to-Market","bullets":["",""]},
   {"title":"90-Day Plan","bullets":["",""]},
   {"title":"Financial Snapshot","bullets":["",""]},
   {"title":"Risks","bullets":["",""]},
   {"title":"Why This Entrepreneur Will Win","bullets":["",""]}
 ]
}`,
  generateFinancialSheet: `
SYSTEM: Output structured JSON for Excel.

TASK: Create:
{
 "sheets":{
   "Startup Costs":{"columns":["Item","Cost","Notes"],"rows":[]},
   "Unit Economics":{"columns":["Metric","Value"],"rows":[]},
   "6-Month Projection":{"columns":["Month","Revenue","Expenses","Profit"],"rows":[]},
   "Scenarios":{"columns":["Scenario","Revenue","Expenses","Profit"],"rows":[]},
 }
}`,
  generateTrainingLesson: `
SYSTEM: You are an expert entrepreneurial coach. Return JSON only.
TASK: Create a short, practical lesson on the topic: "{{topic}}".
The lesson should be easy to understand and actionable for a young entrepreneur.
Format:
{
  "title": "Lesson Title",
  "modules": [
    { "heading": "Section Heading", "body": "Content paragraph..." }
  ],
  "quiz": [
    { "question": "...", "options": ["A", "B", "C"], "correctAnswer": "A" }
  ]
}`,
  voiceChatHandlerPrompt: `
SYSTEM: You are a conversational voice mentor. Speak simply and clearly. Return JSON only.

TASK: Return:
{
 "replyText":"...",
 "followUpQuestion":"...",
 "sessionSummary":"..."
}`
};

// --- Helpers ---

const interpolate = (template: string, data: Record<string, any>) => {
  let res = template;
  for (const key in data) {
    res = res.replace(`{{${key}}}`, JSON.stringify(data[key]));
  }
  return res;
};

// --- Service Methods ---

export const MentorService = {
  
  async generateOpportunities(userProfile: UserProfile): Promise<Opportunity[]> {
    const prompt = interpolate(PROMPTS.generateOpportunities, { userProfile });
    const response = await callGemini({
      prompt,
      jsonSchema: true,
      systemInstruction: "Return valid JSON matching the format."
    });
    try {
      const parsed = JSON.parse(response);
      return parsed.opportunities;
    } catch (e) {
      console.error("Failed to parse opportunities", e);
      throw new Error("AI returned invalid data format");
    }
  },

  async generatePlan(userProfile: UserProfile, selectedIdea: Opportunity): Promise<PlanJSON> {
    const prompt = interpolate(PROMPTS.generatePlan, { userProfile, selectedIdea });
    const response = await callGemini({
      prompt,
      jsonSchema: true
    });
    return JSON.parse(response);
  },

  async generateConceptNote(ideaCtx: any): Promise<PDFJSON> {
    // Append idea context to the static prompt
    const prompt = `${PROMPTS.generateConceptNote}\n\nCONTEXT: ${JSON.stringify(ideaCtx)}`;
    const response = await callGemini({ prompt, jsonSchema: true });
    return JSON.parse(response);
  },

  async generatePitchDeck(ideaCtx: any): Promise<PPTJSON> {
    const prompt = `${PROMPTS.generatePitchOutline}\n\nCONTEXT: ${JSON.stringify(ideaCtx)}`;
    const response = await callGemini({ prompt, jsonSchema: true });
    return JSON.parse(response);
  },

  async generateFinancials(ideaCtx: any): Promise<ExcelJSON> {
    const prompt = `${PROMPTS.generateFinancialSheet}\n\nCONTEXT: ${JSON.stringify(ideaCtx)}`;
    const response = await callGemini({ prompt, jsonSchema: true });
    return JSON.parse(response);
  },

  async generateTrainingLesson(topic: string): Promise<TrainingLesson> {
    const prompt = interpolate(PROMPTS.generateTrainingLesson, { topic });
    const response = await callGemini({ prompt, jsonSchema: true });
    return { ...JSON.parse(response), id: Date.now().toString(), topic };
  },

  async voiceReply(history: {role:string, text:string}[], lastInput: string): Promise<{replyText: string, followUpQuestion: string, sessionSummary?: string}> {
    const conversation = history.map(h => `${h.role}: ${h.text}`).join('\n');
    const fullPrompt = `${PROMPTS.voiceChatHandlerPrompt}\n\nHISTORY:\n${conversation}\n\nUSER INPUT: ${lastInput}`;
    
    const response = await callGemini({ prompt: fullPrompt, jsonSchema: true });
    return JSON.parse(response);
  }
};