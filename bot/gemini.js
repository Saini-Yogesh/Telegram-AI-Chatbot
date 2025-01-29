import fetch from "node-fetch";
import ChatHistory from "../models/chatHistory.js";

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

    if (result.error) {
      return "Sorry, I couldn't process your request.";
    }

    // Extract the response text from the content's parts
    const responseText =
      result.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response available.";

    // Save chat history for the Gemini response
    const chatHistory = new ChatHistory({
      user_input: prompt,
      bot_response: responseText,
      timestamp: new Date(),
    });
    await chatHistory.save();

    return responseText;
  } catch (error) {
    console.error("Error connecting to Gemini API:", error);
    return "An error occurred while fetching a response.";
  }
}

export default getGeminiResponse;
