import { GoogleGenAI, Type, Modality } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface Explanation {
    metaphor: string;
    issues: string;
    usage: string;
}

export async function analyzePrescription(base64Image: string, mimeType: string): Promise<string[]> {
    try {
        const imagePart = {
            inlineData: { data: base64Image, mimeType },
        };
        const textPart = {
            text: "Analyze the attached image of a medical prescription. Identify and extract all distinct medication names mentioned. Return only a JSON object with a single key 'medications' which is an array of strings. For example: {\"medications\": [\"Lisinopril\", \"Metformin\"]}. If no medications are found, return an empty array.",
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        medications: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                                description: "The name of a single medication found on the prescription.",
                            }
                        }
                    },
                    required: ["medications"]
                }
            }
        });

        const jsonText = response.text.trim();
        const parsedResult = JSON.parse(jsonText);
        // Ensure we always return an array
        return Array.isArray(parsedResult.medications) ? parsedResult.medications : [];

    } catch (error) {
        console.error("Error analyzing prescription:", error);
        throw new Error("Failed to analyze prescription image. The image may be unclear or not a prescription.");
    }
}


export async function correctDrugName(drugName: string): Promise<string> {
    try {
        const prompt = `A user entered the drug name "${drugName}". If this is a common medication name but has a typo, provide the corrected spelling. If it seems correct, return the original name. Only return the final drug name, and nothing else.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error correcting drug name:", error);
        // Fallback to original name on error
        return drugName;
    }
}


export async function generateExplanation(drugName: string): Promise<Explanation> {
    try {
        const prompt = `For the drug "${drugName}", provide a simple explanation for a patient. Include: 1. A visual metaphor for how it works (2-3 sentences). 2. A simple list of the main issues it solves. 3. General, non-prescriptive advice on when it's typically taken (e.g., with food, in the morning).`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        metaphor: {
                            type: Type.STRING,
                            description: "A simple, visual metaphor or analogy for how the drug works. 2-3 short sentences."
                        },
                        issues: {
                            type: Type.STRING,
                            description: "A simple, bulleted or comma-separated list of the primary conditions or issues the drug addresses."
                        },
                        usage: {
                            type: Type.STRING,
                            description: "General, non-prescriptive advice on when the drug is commonly taken to maximize effectiveness or minimize side effects (e.g., 'with meals', 'at bedtime')."
                        }
                    },
                    required: ["metaphor", "issues", "usage"]
                }
            }
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Explanation;

    } catch (error) {
        console.error("Error generating explanation:", error);
        throw new Error("Failed to generate text explanation from Gemini.");
    }
}


export async function generateImage(explanationPrompt: string): Promise<string> {
    try {
        // const imagePrompt = `Create a simple, friendly, and metaphorical illustration for a patient based on this description: "${explanationPrompt}". The style should be a clean, colorful, flat vector illustration or a friendly cartoon. Avoid any realistic, complex, or scary medical imagery. The image should be symbolic and easy to interpret.`;
        const imagePrompt = `Create a simple, friendly, and metaphorical comic styled illustration for a patient based on this description: "${explanationPrompt}". The style should be a clean, colorful, flat vector illustration or a friendly cartoon. Avoid any realistic, complex, or scary medical imagery. The image should be symbolic and easy to interpret. It should be in a storyboard format with 2-3 panels that visually represent the metaphor.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts: [{ text: imagePrompt }] },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              const base64ImageBytes: string = part.inlineData.data;
              const mimeType = part.inlineData.mimeType;
              return `data:${mimeType};base64,${base64ImageBytes}`;
            }
        }
        
        throw new Error("No image was generated in the response.");

    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate image from Gemini.");
    }
}