import express from "express";
import cors from "cors";
import multer from "multer";
import voiceToText from "./functions/VoiceToText.js";
import fs from "fs";
import dotenv from "dotenv";
import textGeneration from "./functions/textgeneration.js";
import textToVoid from "./functions/TextToVoid.js";
import { Readable } from "stream";
import streamToBuffer from "./functions/streamToBuffer.js";
import path from "path";

dotenv.config();

const upload = multer({ dest: "uploads/" });

const app = express();
const port = 5000;

app.use(cors());

// Define a route for GET requests to the root URL
app.get("/api/check_health", (req, res) => {
  res.send("Server is healthy!");
});

app.post("/api/chat", upload.single("audio"), async (req, res) => {
  const tempPath = req.file.path;
  const targetPath = path.join("uploads", "audio.mp3");
  fs.renameSync(tempPath, targetPath);
  //   const audioBuffer = fs.readFileSync(targetPath);
  //ok
  const text = await voiceToText(targetPath);
  if (text.length < 3) {
    res.status(400).send("Audio is too short!");
    return;
  }
  const result = await textGeneration(text);
  if (result.length < 3) {
    res.status(500).send("Failed to generate text!");
    return;
  }
  const audio = await textToVoid(result);
  if (audio == null) {
    res.status(500).send("Failed to generate audio!");
    return;
  }
  const reader = audio.getReader();
  const stream = new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) {
        this.push(null);
      } else {
        this.push(value);
      }
    },
  });
  const audioBuffer = await streamToBuffer(stream);
  res.set("Content-Type", "audio/mpeg");
  res.send(audioBuffer);
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
