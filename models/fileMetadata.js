import mongoose from "mongoose";

const fileMetadataSchema = new mongoose.Schema({
  file_name: { type: String, required: true },
  file_type: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const FileMetadata = mongoose.model("FileMetadata", fileMetadataSchema);

export default FileMetadata;
