import fs from "fs";
import Groq from "groq-sdk";

type Uploadable = File | Blob;

// Initialize the Groq client
const groq = new Groq();

export async function generate_transcript(video: Uploadable) {
  const transcription = await groq.audio.transcriptions.create({
    file: video as File,
    model: "whisper-large-v3-turbo",
    prompt: "Specify context or spelling",
    response_format: "json",
    language: "en",
    temperature: 0.0,
  });

  return transcription.text;
}

export async function generate_embeddings(video: Uploadable) {
  const transcript = generate_transcript(video);
  const pre_embedding = "";
}
