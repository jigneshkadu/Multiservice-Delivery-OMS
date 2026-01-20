import { GoogleGenAI } from "@google/genai";

export interface GroundingResult {
  title: string;
  address: string;
  uri: string;
}

// Function to search for nearby services using Gemini Maps Grounding
export const searchNearbyServices = async (query: string, lat: number, lng: number): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("API Key not found in environment variables");
    return "Please configure the API Key to use AI search.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find places related to: ${query}. The user is located at lat: ${lat}, lng: ${lng}. Provide a helpful list of top 3 options.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
            retrievalConfig: {
                latLng: {
                    latitude: lat,
                    longitude: lng
                }
            }
        }
      },
    });

    // We return the text. The UI component should parse the grounding chunks if needed,
    // but for this requirement, we will display the text response which usually contains the list.
    // We also log grounding chunks for debugging or advanced rendering.
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    console.log("Grounding Chunks:", groundingChunks);

    return response.text || "No results found via AI.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error searching for services.";
  }
};