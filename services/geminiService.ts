import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini Client
// Note: In a production environment, ensure process.env.API_KEY is set.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export interface GenerationRequest {
  systemInstruction?: string;
  prompt: string;
  jsonSchema?: any; // Using explicit schema if needed
  model?: string;
}

export const callGemini = async (req: GenerationRequest): Promise<string> => {
  if (!apiKey) {
    console.warn("No API Key found. Returning mock response if available or throwing error.");
    // For demo purposes, we might want to throw or handle gracefully.
    // throw new Error("API Key missing");
  }

  try {
    const modelId = req.model || 'gemini-2.5-flash';
    
    const config: any = {
      temperature: 0.7,
    };

    if (req.systemInstruction) {
      config.systemInstruction = req.systemInstruction;
    }

    if (req.jsonSchema) {
      config.responseMimeType = "application/json";
      // We are passing raw schema for simplicity in this demo structure
      // Ideally map to Type.OBJECT etc.
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: req.prompt,
      config: config
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");
    return text;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
