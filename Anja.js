@cmd install anja.js const axios = require('axios');

const fonts = {
  a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂",
  j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆", n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋",
  s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
  A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜",
  J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥",
  S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭",
};

const Prefixes = [
  'anja',
  'bot', 
  'thea',
];

module.exports = {
  config: {
    name: "anja",
    version: "1.0.1",
    author: "aesther",
    longDescription: "Ask little Anja your questions, French edition no prefix",
    category: "𝗔𝗜",
    guide: {
      en: "{p} questions",
    },
  },

  onStart: async function () {
    // Initialization logic here if needed
  },

  onChat: async function ({ event, message, api }) {
    try {
      // Check if the message starts with a valid prefix
      const prefix = Prefixes.find(p => event.body && event.body.trim().toLowerCase().startsWith(p));
      if (!prefix) {
        return; // Invalid prefix, ignore the command
      }

      // Extract the question from the message
      const prompt = event.body.substring(prefix.length).trim();
      if (!prompt) {
        await message.reply(" 💬");
        api.setMessageReaction("🤤", event.messageID, () => {}, true); // Set reaction
        return;
      }

      // Construct the API URL with proper encoding
      const apiUrl = `https://hiroshi-rest-api.replit.app/ai/llama?ask=${encodeURIComponent(prompt)}`;

      // Make a GET request to the AI API
      const response = await axios.get(apiUrl);

      // Check if API response contains data and msg field
      if (response.data && response.data.msg !== undefined && response.data.msg !== null) {
        let msg = response.data.response;
        api.setMessageReaction("💬", event.messageID, () => {}, true); // Set reaction

        // Transform the message with the specified font
        msg = msg.split('').map(char => fonts[char] || char).join('');

        await message.reply(msg);
      } else {
        await message.reply("I couldn't find an answer to that question.");
      }

    } catch (error) {
      console.error("Error:", error.message);
      await message.reply("Sorry, I couldn't process your question at the moment.");
    }
  }
};
