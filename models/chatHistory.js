import mongoose from "mongoose";

const chatHistorySchema = new mongoose.Schema({
  user_input: String,
  bot_response: String,
  timestamp: Date,
});

const ChatHistory = mongoose.model("ChatHistory", chatHistorySchema);
export default ChatHistory;
