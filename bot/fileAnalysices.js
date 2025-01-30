import fetch from "node-fetch"; // Import fetch for API requests
import SaveChat from "./saveChat.js"; // Import SaveChat for chat history
import FileMetadata from "../models/fileMetadata.js"; // Import FileMetadata model for saving metadata

// Analyze file content (PDF or image) using the Gemini API
async function fileAnalysices(fileUrl) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const fileType = fileUrl.endsWith(".pdf") ? "PDF" : "photo"; // Determine file type
    const analysisPrompt =
      fileType === "PDF"
        ? `Analyze the content from this PDF file: ${fileUrl}`
        : `Describe the contents of this image: ${fileUrl}`;

    // Send analysis request to Gemini API
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: analysisPrompt }] }],
      }),
    });

    const result = await response.json();

    if (result.error) {
      return "Sorry, I couldn't process your request, please try again later.";
    }

    // Extract response description
    const description =
      result.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No analysis available.";

    // Save file metadata in MongoDB
    const fileMetadata = new FileMetadata({
      file_name: fileUrl.split("/").pop() || "Unnamed File",
      file_type: fileType,
      description: description,
      timestamp: new Date(),
    });

    await fileMetadata.save();

    // Save analysis result in chat history
    await SaveChat(`${fileType} URL: ${fileUrl}`, description);

    return description;
  } catch (error) {
    console.error("Error connecting to Gemini API:", error); // Log errors
    return "An error occurred while analyzing the file."; // Error message
  }
}

export default fileAnalysices; // Export the function
