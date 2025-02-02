import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateTextEmbedding(text: string) {
  const gemini_API_KEY = process.env.GEMINI_API_KEY || "";
  const ai = new GoogleGenerativeAI(gemini_API_KEY);
  const model = ai.getGenerativeModel({ model: "text-embedding-004" });
  try {
  } catch (e) {
    console.error(e);
  }
}

export async function summarizeVideo(videoId: string) {}
