import express from "express"; // Import Express
import dotenv from "dotenv"; // Import dotenv for environment variables
import "./bot/bot.js"; // Import bot logic

dotenv.config(); // Load environment variables

const app = express(); // Initialize Express app
const port = 3000; // Define port

app.get("/", (req, res) => {
  res.send("TalkToGeminiBot is running!"); // Root route message
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // Log server start
});
