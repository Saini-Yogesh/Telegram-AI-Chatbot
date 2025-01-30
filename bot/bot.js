import { Telegraf } from "telegraf";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// models
import User from "../models/user.js";
import FileMetadata from "../models/fileMetadata.js";

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// MongoDB connection
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGODB_URI);

// Function to get response from Gemini API
import getGeminiResponse from "./Gemini.js";

// Web search functionality
import webSearch from "./webSearch.js";

// Image/file Handling functionality
import fileAnalysices from "./fileAnalysices.js";

// Handle /start command and user registration
bot.start(async (ctx) => {
  const { first_name, username, id } = ctx.from;
  let user = await User.findOne({ chat_id: id });

  if (!user) {
    ctx.reply("Welcome! Please share your phone number.", {
      reply_markup: {
        keyboard: [[{ text: "Share Contact", request_contact: true }]],
        one_time_keyboard: true,
      },
    });

    const newUser = new User({ first_name, username, chat_id: id });
    await newUser.save();
  } else {
    ctx.reply("Welcome back!");
  }
});

// Store user's phone number
bot.on("contact", async (ctx) => {
  const { phone_number } = ctx.message.contact;
  const user = await User.findOne({ chat_id: ctx.from.id });
  if (user) {
    user.phone_number = phone_number;
    await user.save();
    ctx.reply("Thank you for sharing your contact!");
  }
});

// Handle messages (Gemini and web search)
bot.on("text", async (ctx) => {
  const userMessage = ctx.message.text;

  if (userMessage.startsWith("/websearch")) {
    const query = userMessage.replace("/websearch", "").trim();
    const searchResponse = await webSearch(query);
    ctx.reply(searchResponse);
  } else {
    const geminiResponse = await getGeminiResponse(userMessage);
    ctx.reply(geminiResponse, { parse_mode: "Markdown" });
  }
});

// Image/file Handling
bot.on(["photo", "document"], async (ctx) => {
  try {
    // Extract file information (photo or document)
    const fileId = ctx.message.photo
      ? ctx.message.photo[0].file_id
      : ctx.message.document.file_id;
    const fileType = ctx.message.photo
      ? "photo"
      : ctx.message.document.mime_type; // Check type for document (e.g., PDF, DOCX)
    const file = await bot.telegram.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;

    // Analyze the image/file using the Gemini API (or any other image analysis API)
    const description = await GetGeminiResponseForPhoto(fileUrl);

    // Save metadata (filename, file type, description) in MongoDB
    const fileMetadata = new FileMetadata({
      file_name: file.file_name || "Unnamed File", // Ensure file_name is available
      file_type: fileType,
      description: description, // Ensure description is available
      timestamp: new Date(),
    });

    await fileMetadata.save();

    // Send the analysis result to the user
    ctx.reply(`Here's what I found:-\n\n ${description}`);
  } catch (error) {
    console.error("Error during file/image analysis:", error);
    ctx.reply("Sorry, there was an error analyzing the file.");
  }
});

// Start the bot
bot.launch();
console.log("Bot is running...");
