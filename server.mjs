import express from "express";
import dotenv from "dotenv";
import "./bot/bot.js"; // Import the bot logic

// Load environment variables
dotenv.config();

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("TalkToGeminiBot is running!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
