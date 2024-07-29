@cmd install joke.js const axios = require('axios');

module.exports = {
  config: {
    name: 'joke',
    version: '1.0',
    author: 'aesther',
    role: 0,
    category: 'fun',
    shortDescription: {
      en: 'Tells a random joke.'
    },
    longDescription: {
      en: 'Tells a random joke fetched from the JokeAPI.'
    },
    guide: {
      en: '{pn}'
    }
  },
  onStart: async function ({ api, event }) {
    try {
      const response = await axios.get('https://nash-rest-api.vercel.app/joke');

      if (!response.data || !response.data.joke) {
        throw new Error("No joke found in the response");
      }

      api.sendMessage(response.data.joke, event.threadID);
    } catch (error) {
      api.sendMessage("Couldn't fetch a joke at the moment. Please try again later.", event.threadID);
      api.setMessageReaction("❌", event.messageID, (err) => {}, true);
    }
  }
};
