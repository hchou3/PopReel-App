import Groq from "groq-sdk";

// Initialize the Groq client
const groq_api_key = process.env.GROQ_API_KEY || "";
console.log("GROQ_API_KEY:", groq_api_key); // Double-check it's not undefined

const groq = new Groq({ apiKey: groq_api_key, dangerouslyAllowBrowser: true });

export async function generate_transcript(reel: File): Promise<string> {
  const transcription = await groq.audio.transcriptions.create({
    file: reel,
    model: "whisper-large-v3-turbo",
    prompt: "Specify context or spelling",
    response_format: "json",
    language: "en",
    temperature: 0.0,
  });
  console.log("Transcription:", transcription.text);
  return transcription.text;
}
