import { GoogleGenAI, Type } from "@google/genai";
import { VocabularyItem } from "../types";

const parseJson = (text: string) => {
  try {
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (e) {
    console.error("JSON Parse Error", e);
    return [];
  }
};

export const fetchVocabularyForUnit = async (topic: string): Promise<VocabularyItem[]> => {
  // Use a fallback if no API key is present in development, but in this env we assume it exists.
  if (!process.env.API_KEY) {
    console.error("API Key is missing");
    throw new Error("API Key is missing. Please check your configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
    You are an expert ESL teacher for Grade 1-2 elementary students.
    Generate a vocabulary list based on the provided topic.
    The output must be strictly valid JSON.
    For each word:
    1. 'word': The English word (keep it simple).
    2. 'emoji': A single emoji representing the word.
    3. 'translation': Traditional Chinese translation (繁體中文).
    4. 'fullSentence': A simple example sentence using the word.
    5. 'sentencePart1': The part of the sentence BEFORE the word.
    6. 'sentencePart2': The part of the sentence AFTER the word.
    
    Example input topic: "Fruit"
    Example output item:
    {
      "word": "apple",
      "emoji": "🍎",
      "translation": "蘋果",
      "fullSentence": "This is a red apple.",
      "sentencePart1": "This is a red ",
      "sentencePart2": "."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create 6 vocabulary items for the topic: ${topic}. ensure the sentences are very simple for kids.`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING },
              emoji: { type: Type.STRING },
              translation: { type: Type.STRING },
              fullSentence: { type: Type.STRING },
              sentencePart1: { type: Type.STRING },
              sentencePart2: { type: Type.STRING }
            },
            required: ["word", "emoji", "translation", "fullSentence", "sentencePart1", "sentencePart2"]
          }
        }
      }
    });

    const result = response.text;
    if (!result) return [];
    
    return parseJson(result);

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};