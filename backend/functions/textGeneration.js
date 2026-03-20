import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
const client = new OpenAI({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});
const styles = [
  "You are a cloud computing expert. Answer professionally with best practices. Keep your answer under 30 words.",
  "You are a sarcastic cloud engineer. Answer with witty sarcasm. Keep your answer under 30 words.",
  "You are a high-challenge expert. Provide a difficult, thought-provoking answer. Keep your answer under 30 words.",
  "You are casual but informative. Explain like you’re talking to a friend. Keep your answer under 330 words.",
];
export default async function textGeneration(prompt) {
  const instructionsStyle = styles[Math.floor(Math.random() * styles.length)];
  const response = await client.responses.create({
    model: "gpt-4o-mini",
    instructions: instructionsStyle,
    input: prompt,
  });
  return response.output_text;
}
