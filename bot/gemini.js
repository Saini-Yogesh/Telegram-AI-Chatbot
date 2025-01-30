import fetch from "node-fetch"; // Import fetch for API requests
import SaveChat from "./saveChat.js"; // Import SaveChat to save chat history

// Async function to get a response from Gemini API
async function getGeminiResponse(prompt) {
  try {
    const apiKey = process.env.GEMINI_API_KEY; // Get API key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`; // Gemini API URL

    // Modify prompt to encourage emojis
    const enhancedPrompt = `${prompt}\n\nNote: Please include appropriate emojis in the response to make it more engaging`;

    const response = await fetch(url, {
      // Send POST request to Gemini API
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: enhancedPrompt }] }],
      }),
    });

    const result = await response.json(); // Parse response

    // If there's an error in the response, return error message
    if (result.error) {
      return `Sorry, I couldn't process your request:-\n\n ${result.error.message}`;
    }

    // Extract response text
    const responseText =
      result.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response available.";

    await SaveChat(prompt, responseText); // Save chat history

    return responseText; // Return response
  } catch (error) {
    console.error("Error connecting to Gemini API:", error); // Log errors
    return "An error occurred while fetching a response."; // Error message
  }
}

export default getGeminiResponse; // Export the function
