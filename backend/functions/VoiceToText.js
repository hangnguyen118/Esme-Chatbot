import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
const openai = new OpenAI({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function voiceToText(filePath) {
  const response = await openai.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: "whisper-1",
  });
  return response.text;
}
