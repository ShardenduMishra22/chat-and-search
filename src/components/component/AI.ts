import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY });

export const generateAIResponse = async (query: string): Promise<string> => {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: query,
    });
    
    return result.candidates?.[0]?.content?.parts?.[0]?.text ?? 
      "Sorry, I couldn't generate a response at the moment.";
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Failed to generate response");
  }
};