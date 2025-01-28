import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: String,
  username: String,
  chat_id: { type: Number, unique: true },
  phone_number: String,
});

const User = mongoose.model("User", userSchema);
export default User;
