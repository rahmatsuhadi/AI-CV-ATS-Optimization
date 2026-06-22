import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

/**
 * Generates chat completion using either Google Gen AI SDK (Gemini) or OpenAI SDK,
 * depending on which environment variables are set.
 *
 * Priority:
 * 1. GEMINI_API_KEY -> GoogleGenAI SDK (gemini-2.5-flash)
 * 2. OPENAI_API_KEY -> OpenAI SDK (gpt-4o-mini or custom model configured in environment)
 * 3. Fallback/Local Gateway -> OpenAI client pointing to OpenAI_BASE_URL (http://localhost:20128/v1)
 */
export async function generateChatCompletion(
  systemPrompt: string,
  userPrompt: string,
  options?: { json?: boolean },
): Promise<string> {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (geminiApiKey) {
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    const response = await ai.models.generateContent({
      model: model,
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: options?.json ? "application/json" : undefined,
      },
    });

    return response.text || "";
  }

  // Fallback to OpenAI / Local Gateway
  const baseURL = process.env.OPENAI_BASE_URL || "http://localhost:20128/v1";
  const openai = new OpenAI({
    apiKey: openaiApiKey || "sk-dummy",
    baseURL: baseURL,
  });

  const model =
    process.env.OPENAI_MODEL || "gemini/gemini-3.1-flash-lite-preview";

  const response = await openai.chat.completions.create({
    model: model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: options?.json ? { type: "json_object" } : undefined,
  });

  return response.choices[0]?.message?.content || "";
}
