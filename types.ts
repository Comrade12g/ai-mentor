export interface UserProfile {
  uid: string;
  name: string;
  location: string;
  skills: string[];
  interests: string[];
  budget: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  why_it_fits: string;
  starting_capital_band: string;
  earning_potential_band: string;
  top_risks: string[];
  example_mvp_steps: string[];
}

export interface Task {
  title: string;
  detail: string;
  estimated_hours: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  tag: string;
}

export interface WeekPlan {
  weekNumber: number;
  tasks: Task[];
}

export interface PlanJSON {
  weeks: WeekPlan[];
}

// Document Models
export interface PDFJSON {
  pdf_title: string;
  sections: { heading: string; content: string }[];
}

export interface PPTJSON {
  slides: { title: string; bullets: string[] }[];
}

export interface ExcelJSON {
  sheets: {
    [sheetName: string]: {
      columns: string[];
      rows: (string | number)[][];
    };
  };
}

// Voice Models
export interface VoiceUtterance {
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

export interface VoiceSession {
  id: string;
  summary?: string;
  transcript: VoiceUtterance[];
}

// Admin
export interface PromptPack {
  id: string;
  key: string;
  template: string;
  version: number;
  active: boolean;
}