import ChatHistory from "../models/chatHistory.js"; // Import ChatHistory model

// Async function to save chat history
const saveChatHistory = async (query, replyMessage) => {
  try {
    // Create and save new chat history document
    const chatHistory = new ChatHistory({
      user_input: query,
      bot_response: replyMessage,
      timestamp: new Date(),
    });

    await chatHistory.save();
  } catch (error) {
    console.error("Error saving chat history:", error); // Log errors
  }
};

export default saveChatHistory; // Export the function
