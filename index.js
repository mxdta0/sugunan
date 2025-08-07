const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();

// Get your API tokens from environment variables
const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
const sarvamToken = process.env.SARVAM_API_KEY;

// Check if tokens are set
if (!telegramToken || !sarvamToken) {
  console.error('Error: Please provide TELEGRAM_BOT_TOKEN and SARVAM_API_KEY in your .env file.');
  process.exit(1);
}

// Create a new bot instance
const bot = new TelegramBot(telegramToken, { polling: true });

// Listen for any kind of message
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;

  // Simple check to prevent responding to empty messages or commands
  if (!userMessage || userMessage.startsWith('/')) {
    return;
  }

  // Show a "typing" status while the bot is thinking
  bot.sendChatAction(chatId, 'typing');

  try {
    // Call the Sarvam AI chat completions API
    const response = await axios.post(
      'https://api.sarvam.ai/v1/chat/completions',
      {
        model: 'sarvam-m',
        messages: [{ role: 'user', content: userMessage }],
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sarvamToken}`
        }
      }
    );

    // Get the AI's reply
    const aiReply = response.data.choices[0].message.content;

    // Send the reply back to the Telegram chat
    bot.sendMessage(chatId, aiReply);
  } catch (error) {
    console.error('Error calling Sarvam AI API:', error.response ? error.response.data : error.message);
    bot.sendMessage(chatId, 'Sorry, I couldn\'t get a response from the AI at the moment. Please try again later.');
  }
});

console.log('Sarvam AI Telegram Bot is running...');
