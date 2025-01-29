import { Telegraf } from "telegraf";
import mongoose from "mongoose";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// MongoDB connection
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGODB_URI);

// Function to get response from Gemini API
import getGeminiResponse from "./Gemini.js";

// Web search functionality
import webSearch from "./webSearch.js";

// File analysis functionality

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
    ctx.reply(geminiResponse);
  }
});

// Image/File Handling
bot.on(["photo", "document"], async (ctx) => {
  ctx.reply("This feature is under development. Please check back later.");
});

// Start the bot
bot.launch();
console.log("Bot is running...");
