# Telegram AI Chatbot

## Overview

The Telegram AI Chatbot is a versatile and intelligent bot that provides various functionalities, including file analysis for PDFs and images, along with AI-powered conversational abilities. The project integrates APIs for Natural Language Processing (NLP) and document/image analysis, providing users with a robust chatbot experience.

## Features

- **AI-Powered Conversations:** Leverages NLP capabilities to understand and respond to user queries.
- **File Analysis:** Supports analyzing PDFs and image files to extract meaningful insights and summaries.
- **Markdown Formatting:** Properly formats response messages for better readability.
- **Database Integration:** Stores metadata and chat history in MongoDB.
- **Error Handling:** Robust error handling to provide meaningful feedback for users.

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB
- **APIs:** Google Gemini API for file analysis, Telegram Bot API
- **Other Tools:** Nodemon for development, Telegraf for Telegram bot handling

## Prerequisites

Make sure you have the following installed:

- Node.js (v18 or higher)
- MongoDB
- Telegram Bot Token
- Gemini API Key

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Saini-Yogesh/Telegram-AI-Chatbot.git
   cd Telegram-AI-Chatbot
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```env
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   GOOGLE_SEARCH_API_KEY=your_google_search_api_key_api_key
   SEARCH_ENGINE_ID=your_search_engine_id_api_key

   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. Open Telegram and search for your bot using the username provided during bot creation.
2. Send commands or upload a PDF/image file for analysis.
3. The bot will respond with a detailed analysis or appropriate responses.

## Project Structure

```
TELEGRAM-AI-CHATBOT/
├── bot/
│   ├── bot.js             # Telegram bot setup
│   ├── fileAnalysis.js    # Handles file analysis for PDFs and images
│   ├── gemini.js          # Handles AI responses using Gemini API
│   ├── saveChat.js        # Save chat history to MongoDB
│   ├── webSearch.js       # Web search functionality
├── config/
│   ├── config.js          # Configuration settings
├── models/
│   ├── chatHistory.js     # Mongoose model for chat history
│   ├── fileMetadata.js    # Mongoose model for file metadata
│   ├── user.js            # Mongoose model for user data
├── node_modules/          # Dependencies
├── .env                   # Environment variables
├── .gitignore             # Git ignore file
├── package.json           # Project metadata and dependencies
├── package-lock.json      # Lock file for dependencies
├── README.md              # Project documentation
└── server.mjs             # Main server file

```

## API Endpoints

- `POST /analyze` - Analyze uploaded file (PDF or image) and return insights.
- `POST /chat` - Handle text-based chat interactions.

## Contributing

Contributions are welcome! To contribute:

1. Fork the project.
2. Create a new branch.
3. Make your changes.
4. Submit a pull request.

## Troubleshooting

- **Markdown Error:** Ensure special characters are properly escaped when using `MarkdownV2` in Telegram messages.
- **API Errors:** Verify that the correct Gemini API key is set and the API endpoint is accessible.
- **Bot Not Responding:** Double-check the Telegram Bot Token and ensure the bot is enabled on Telegram.

## Acknowledgments

Special thanks to the open-source community and API providers that make this project possible.
