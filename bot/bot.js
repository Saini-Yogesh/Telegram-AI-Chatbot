import { Telegraf } from "telegraf";
import fetch from "node-fetch";
import mongoose from "mongoose";
import User from "../models/user.js";
import ChatHistory from "../models/chatHistory.js";
import dotenv from "dotenv";

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// MongoDB connection
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGODB_URI);

dotenv.config();

// Function to get response from Gemini API
async function getGeminiResponse(prompt) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const result = await response.json();
    // console.log("Full response:", result);

    if (result.error) {
      //   console.error("Gemini API Error:", result.error.message);
      return "Sorry, I couldn't process your request.";
    }

    // Extract the response text from the content's parts
    const responseText =
      result.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response available.";
    return responseText;
  } catch (error) {
    // console.error("Error connecting to Gemini API:", error);
    return "An error occurred while fetching a response.";
  }
}

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

// Handle text messages and interact with Gemini API
bot.on("text", async (ctx) => {
  const userMessage = ctx.message.text;
  const responseText = await getGeminiResponse(userMessage);

  const chatHistory = new ChatHistory({
    user_input: userMessage,
    bot_response: responseText,
    timestamp: new Date(),
  });
  await chatHistory.save();

  ctx.reply(responseText);
});

// Start the bot
bot.launch();
console.log("Bot is running...");
