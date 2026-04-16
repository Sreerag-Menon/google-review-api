import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Calls Google Gemini with a fully-built prompt + randomised temperature.
 * Returns the generated text string.
 */
export async function generateWithGemini(prompt, temperature = 0.9) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel(
    { model: "gemini-2.5-flash" },
    { generationConfig: { temperature, topP: 0.95, topK: 50 } }
  );

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
