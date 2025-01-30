import fetch from "node-fetch";
import SaveChat from "./saveChat.js";
import FileMetadata from "../models/fileMetadata.js";

async function fileAnalysices(fileUrl) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const fileType = fileUrl.endsWith(".pdf") ? "PDF" : "photo";
    const analysisPrompt =
      fileType === "PDF"
        ? `Analyze the content from this PDF file: ${fileUrl}`
        : `Describe the contents of this image: ${fileUrl}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: analysisPrompt,
              },
            ],
          },
        ],
      }),
    });

    const result = await response.json();
    // console.log(result);
    if (result.error) {
      return "Sorry, I couldn't process your request, please try again later.";
    }

    const description =
      result.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No analysis available.";

    // Save file metadata to MongoDB
    const fileMetadata = new FileMetadata({
      file_name: fileUrl.split("/").pop() || "Unnamed File",
      file_type: fileType,
      description: description,
      timestamp: new Date(),
    });

    await fileMetadata.save();

    // Optionally save chat history
    await SaveChat(`${fileType} URL: ${fileUrl}`, description);

    return description;
  } catch (error) {
    console.error("Error connecting to Gemini API:", error);
    return "An error occurred while analyzing the file.";
  }
}

export default fileAnalysices;
