@cmd install quote.js const axios = require('axios');

module.exports = {
  config: {
    name: "quote",
    author: "aesther",
    countDown: 5,
    role: 0,
    category: "fun",
    shortDescription: {
      en: "Get a simple random quote",
    },
  },
  onStart: async function ({ api, event, args }) {
    try {
      const response = await axios.get('https://nash-rest-api.vercel.app/quote');

      if (!response.data || !response.data.text || !response.data.author) {
        return api.sendMessage("No quote found. Please try again later.", event.threadID);
      }

      const { text, author } = response.data;
      const message = `⊂(・﹏・⊂)𝗤𝗨𝗢𝗧𝗘 :\n「💬」${text} ⊰᯽⊱┈──╌❊╌──┈⊰᯽⊱\n➤ ${author}`;
      return api.sendMessage(message, event.threadID);
    } catch (error) {
      console.error(error);
      return api.sendMessage("An error occurred while fetching the quote. Please try again later.", event.threadID);
    }
  }
};
