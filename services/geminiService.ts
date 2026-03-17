
// Always use GoogleGenAI from @google/genai
import { GoogleGenAI } from "@google/genai";

export interface GroundingResult {
  title: string;
  address: string;
  uri: string;
}

// Function to search for nearby services using Gemini Maps Grounding
export const searchNearbyServices = async (query: string, lat: number, lng: number): Promise<string> => {
  // Always create a new instance right before making an API call to ensure current API key usage
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      // Maps grounding is only supported in Gemini 2.5 series models.
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

    // The .text property (not a method) directly returns the extracted string output.
    let resultText = response.text || "No results found via AI.";
    
    // For Google Maps grounding, extracting URLs from groundingChunks is mandatory.
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks && Array.isArray(groundingChunks)) {
      const links: string[] = [];
      groundingChunks.forEach((chunk: any) => {
        // Extract maps URI and title
        if (chunk.maps?.uri) {
          links.push(`- [${chunk.maps.title || 'View on Maps'}](${chunk.maps.uri})`);
        }
        // Extract review snippets if available as additional links
        if (chunk.maps?.placeAnswerSources?.reviewSnippets) {
           chunk.maps.placeAnswerSources.reviewSnippets.forEach((snippet: any) => {
             if (snippet.uri) {
                links.push(`- [Review](${snippet.uri})`);
             }
           });
        }
      });
      
      if (links.length > 0) {
        resultText += "\n\n**Related Links:**\n" + links.join("\n");
      }
    }

    return resultText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error searching for services.";
  }
};
