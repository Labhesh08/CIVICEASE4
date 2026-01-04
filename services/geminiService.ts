
import { GoogleGenAI, Type } from "@google/genai";
import { AICategorization } from "../types";
import { DEPARTMENTS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const categorizeIssue = async (description: string): Promise<AICategorization> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Categorize the following civic complaint and provide a short 1-sentence summary: "${description}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description: "One of: Roads, Water, Garbage, Electricity, Other",
            },
            summary: {
              type: Type.STRING,
              description: "A professional summary of the issue.",
            },
          },
          required: ["category", "summary"],
        },
      },
    });

    const result = JSON.parse(response.text);
    const category = result.category as keyof typeof DEPARTMENTS || 'Other';
    
    return {
      category,
      department: DEPARTMENTS[category].name,
      helpline: DEPARTMENTS[category].helpline,
      summary: result.summary,
    };
  } catch (error) {
    console.error("AI Categorization failed", error);
    return {
      category: "Other",
      department: DEPARTMENTS.Other.name,
      helpline: DEPARTMENTS.Other.helpline,
      summary: "Manual review required for this issue.",
    };
  }
};

export const geocodeAddress = async (address: string): Promise<{ lat: number, lng: number }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Act as a geocoding service. Return only a JSON object containing the latitude (lat) and longitude (lng) for the following address: "${address}". Ensure coordinates are accurate for the location.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lat: { type: Type.NUMBER },
            lng: { type: Type.NUMBER },
          },
          required: ["lat", "lng"],
        },
      },
    });
    const coords = JSON.parse(response.text);
    // Basic validation
    if (typeof coords.lat !== 'number' || typeof coords.lng !== 'number') {
        throw new Error("Invalid coordinates");
    }
    return coords;
  } catch (error) {
    console.error("Geocoding failed", error);
    // Fallback coordinates (Pune, India as a central point for demo)
    return { lat: 18.5204, lng: 73.8567 };
  }
};
