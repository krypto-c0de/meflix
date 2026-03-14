import { GoogleGenerativeAI } from "@google/generative-ai";
import { env, requireEnvVars } from "../config/env.js";

let model = null;

function getModel() {
  if (!model) {
    requireEnvVars(["GEMINI_API_KEY"]);
    const genAI = new GoogleGenerativeAI(env.geminiApiKey);
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  return model;
}

export async function generateJson(prompt) {
  const currentModel = getModel();

  const result = await currentModel.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(result.response.text());
}
