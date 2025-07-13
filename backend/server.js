import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { formatCustomInstructions } from "./formatCustomInstructions.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:4200", // Angular dev server
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" })); // Handle large payloads

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Personify Backend is running" });
});

// Main API endpoint for processing answers
app.post("/api/process-answers", async (req, res) => {
  try {
    console.log("📨 Received request to process answers");

    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        error: "Invalid request body. Expected { answers: [...] }",
      });
    }

    console.log(`📊 Processing ${answers.length} answers`);

    // Format the data for OpenAI
    const answersPayload = { answers };
    const answersJson = JSON.stringify(answersPayload);

    console.log("🤖 Calling OpenAI API...");

    // Call OpenAI API
    const result = await formatCustomInstructions(answersJson);

    console.log("✅ OpenAI API call successful");
    console.log("📤 Response keys:", Object.keys(result));

    // Return the formatted response
    res.json(result);
  } catch (error) {
    console.error("❌ Error processing answers:", error);

    // Return a user-friendly error
    res.status(500).json({
      error: "Failed to process answers",
      message: error.message || "Unknown error occurred",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Personify Backend running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 API endpoint: http://localhost:${PORT}/api/process-answers`);
});
