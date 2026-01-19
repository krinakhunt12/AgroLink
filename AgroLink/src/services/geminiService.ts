
import { GoogleGenAI } from "@google/genai";
import AppLogger from "../utils/logger";

export const getAgriculturalAdvice = async (userQuery: string): Promise<{ text: string, sources?: any[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    AppLogger.info("Fetching agricultural advice for query:", userQuery);
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userQuery,
      config: {
        systemInstruction: `તમે ગુજરાતના ખેડૂતો માટે "AI કૃષિ સલાહકાર" છો. 
        તમારે ખેડૂતોને પાક, હવામાન, અને બજારના ભાવો વિશે માર્ગદર્શન આપવાનું છે.
        નિયમો:
        1. હંમેશા ગુજરાતીમાં જ જવાબ આપો.
        2. ગામડાના ખેડૂત સમજી શકે તેવી સરળ અને મીઠી ભાષાનો ઉપયોગ કરો.
        3. જવાબ ટૂંકો, સચોટ અને વ્યવહારુ હોવો જોઈએ.
        4. જો તમે ગૂગલ સર્ચનો ઉપયોગ કરો છો, તો ખાતરી કરો કે માહિતી નવીનતમ છે.
        5. ખેડૂતોને હિંમત અને પ્રોત્સાહન આપતા રહો.`,
        temperature: 0.7,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "માફ કરશો, અત્યારે માહિતી ઉપલબ્ધ નથી.";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    return { text, sources };
  } catch (error) {
    AppLogger.error("Gemini API Error:", error);
    return { text: "તકનીકી સમસ્યાને કારણે જવાબ આપવામાં અસમર્થ છીએ. કૃપા કરીને થોડી વાર પછી પ્રયાસ કરો." };
  }
};
