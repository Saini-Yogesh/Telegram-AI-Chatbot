import fetch from "node-fetch";
import SaveChat from "./saveChat.js";

async function webSearch(query) {
  try {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const searchEngineId = process.env.SEARCH_ENGINE_ID;

    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(
      query
    )}`;

    const response = await fetch(searchUrl);
    const searchResults = await response.json();

    let replyMessage;

    if (searchResults.items?.length) {
      replyMessage = searchResults.items
        .slice(0, 3)
        .map((result) => `${result.title}\n🔗 ${result.link}`)
        .join("\n\n");
    } else {
      replyMessage = `No search results found for "${query}".`;
    }

    // Save the web search query and response in the chat history
    await SaveChat(`/websearch ${query}`, replyMessage);

    return replyMessage;
  } catch (error) {
    console.error("Error during web search:", error);
    return "An error occurred while performing the web search.";
  }
}

export default webSearch;
