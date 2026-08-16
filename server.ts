import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { syncUser, syncUserData, getUserData, getUsers } from "./src/firebase-admin";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Firebase Sync API routes
  app.post("/api/syncUser", syncUser);
  app.post("/api/syncUserData", syncUserData);
  app.get("/api/userData/:uid/:key", getUserData);
  app.get("/api/users", getUsers);

  // Google Site Verification route
  app.get("/googlefe251071e632c729.html", (req, res) => {
    res.type("text/html").send("google-site-verification: googlefe251071e632c729.html");
  });

  // Gemini API routes
  app.post("/api/hint", async (req, res) => {
    try {
      const { question, answer } = req.body;
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Give ONE short hint (max 18 words) for this flashcard. Do NOT reveal the answer.\nQuestion: ${question}\nAnswer: ${answer}`;
      
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          maxOutputTokens: 80,
          temperature: 0.5,
        }
      });
      
      res.json({ hint: response.text?.trim() });
    } catch (error) {
      console.error("Gemini API error:", error);
      res.status(500).json({ error: "Failed to generate hint" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
