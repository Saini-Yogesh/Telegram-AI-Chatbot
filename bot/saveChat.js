import ChatHistory from "../models/chatHistory.js";

const saveChatHistory = async (query, replyMessage) => {
  try {
    const chatHistory = new ChatHistory({
      user_input: query,
      bot_response: replyMessage,
      timestamp: new Date(),
    });

    await chatHistory.save();
  } catch (error) {
    console.error("Error saving chat history:", error);
  }
};

export default saveChatHistory;
