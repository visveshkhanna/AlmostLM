import { createOpenAI } from "@ai-sdk/openai";
import { OpenAI } from "openai";

export const openai = new OpenAI({
  baseURL: process.env.NOVITA_API_URL,
  apiKey: process.env.NOVITA_API_KEY,
});

export const openaiAiSDK = createOpenAI({
  baseURL: process.env.NOVITA_API_URL,
  apiKey: process.env.NOVITA_API_KEY,
});
