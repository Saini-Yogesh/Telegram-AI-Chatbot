import fetch from "node-fetch"; // Import fetch for API requests
import SaveChat from "./saveChat.js"; // Import SaveChat to save chat history

async function webSearch(query) {
  try {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY; // Get API key
    const searchEngineId = process.env.SEARCH_ENGINE_ID; // Get search engine ID

    // Build the search URL
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(
      query
    )}`;

    const response = await fetch(searchUrl); // Fetch search results
    const searchResults = await response.json(); // Parse JSON response

    let replyMessage;

    // If results exist, format the reply message
    if (searchResults.items?.length) {
      replyMessage = searchResults.items
        .slice(0, 3)
        .map((result) => `${result.title}\n🔗 ${result.link}`)
        .join("\n\n");
    } else {
      replyMessage = `No search results found for "${query}".`; // No results message
    }

    await SaveChat(`/websearch ${query}`, replyMessage); // Save chat history

    return replyMessage; // Return reply message
  } catch (error) {
    console.error("Error during web search:", error); // Log errors
    return "An error occurred while performing the web search."; // Error message
  }
}

export default webSearch; // Export the function
