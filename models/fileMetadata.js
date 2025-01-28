import mongoose from "mongoose";

const fileMetadataSchema = new mongoose.Schema({
  filename: String,
  description: String,
});

const FileMetadata = mongoose.model("FileMetadata", fileMetadataSchema);
export default FileMetadata;
