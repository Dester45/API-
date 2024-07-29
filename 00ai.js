@cmd install 0ai.js const axios = require('axios');

const Prefixes = [
  'ai',
  'anjara',
  'aesther',
];

const ln = [
  "ab", "aa", "af", "ak", "sq", "am", "ar", "an", "hy", "as", "av", "ae",
  "ay", "az", "bm", "ba", "eu", "be", "bn", "bh", "bi", "bs", "br", "bg",
  "my", "ca", "km", "ch", "ce", "ny", "zh", "cu", "cv", "kw", "co", "cr",
  "hr", "cs", "da", "dv", "nl", "dz", "en", "eo", "et", "ee", "fo", "fj",
  "fi", "fr", "ff", "gd", "gl", "lg", "ka", "de", "ki", "el", "kl", "gn",
  "gu", "ht", "ha", "he", "hz", "hi", "ho", "hu", "is", "io", "ig", "id",
  "ia", "ie", "iu", "ik", "ga", "it", "ja", "jv", "kn", "kr", "ks", "kk",
  "rw", "kv", "kg", "ko", "kj", "ku", "ky", "lo", "la", "lv", "lb", "li",
  "ln", "lt", "lu", "mk", "mg", "ms", "ml", "mt", "gv", "mi", "mr", "mh",
  "ro", "mn", "na", "nv", "nd", "ng", "ne", "se", "no", "nb", "nn", "ii",
  "oc", "oj", "or", "om", "os", "pi", "pa", "ps", "fa", "pl", "pt", "qu",
  "rm", "rn", "ru", "sm", "sg", "sa", "sc", "sr", "sn", "sd", "si", "sk",
  "sl", "so", "st", "nr", "es", "su", "sw", "ss", "sv", "tl", "ty", "tg",
  "ta", "tt", "te", "th", "bo", "ti", "to", "ts", "tn", "tr", "tk", "tw",
  "ug", "uk", "ur", "uz", "ve", "vi", "vo", "wa", "cy", "fy", "wo", "xh",
  "yi", "yo", "za", "zu"
];

module.exports = {
  config: {
    name: "ai",
    version: "1",
    author: "aesther",
    longDescription: "Command with no prefix\n💬 - LLaMA, a large language model developed by Meta AI that can understand and respond to human input in a conversational manner. I'm a type of artificial intelligence designed to generate human-like text responses.",
    category: "ai",
    guide: {
      en: "{p} questions",
    },
  },
  onStart: async function () {
    // Initialization logic here if needed
  },
  onChat: async function ({ api, event, args, message }) {
    try {
      // Check if the message starts with a valid prefix
      const prefix = Prefixes.find((p) => event.body && event.body.trim().toLowerCase().startsWith(p.toLowerCase()));
      if (!prefix) {
        return; // Ignore the command if prefix is not recognized
      }

      // Extract the question from the message
      const prompt = event.body.substring(prefix.length).trim();
      const senderID = event.senderID;
      const senderInfo = await api.getUserInfo(senderID); // Use senderID directly
      const senderName = senderInfo[senderID].name;

      if (!prompt) {
        await message.reply(`🌸𝙎𝘼𝙉𝘾𝙃𝙊𝙆𝙐𝙄𝙉🌸 :\n\nHello ${senderName} ⁉️`);
        api.setMessageReaction("⁉️", event.messageID, () => {}, true);
        return;
      }

      // Make a GET request to the AI API
      const response = await axios.get(`https://nash-rest-api.vercel.app/gpt3?prompt=${encodeURIComponent(prompt)}`);
      const answer = response.data.result.reply;

      await message.reply(`🌸𝙎𝘼𝙉𝘾𝙃𝙊𝙆𝙐𝙄𝙉🌸 :\n[💬] ${senderName}\n\n${answer} 🩷`);
      api.setMessageReaction("💬", event.messageID, () => {}, true);

      // Google Translate TTS for voice response
      const lng = "fr"; // Default language for TTS
      const maxLength = 200; // Limite de longueur pour une requête TTS Google Translate
      const chunks = [];
      for (let i = 0; i < answer.length; i += maxLength) {
        chunks.push(answer.substring(i, i + maxLength));
      }

      for (const chunk of chunks) {
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lng}&client=tw-ob&q=${encodeURIComponent(chunk)}`;
        // Envoyer la réponse avec le texte à dire
        await api.sendMessage({
          body: "",
          attachment: await global.utils.getStreamFromURL(url)
        }, event.threadID);
      }

    } catch (error) {
      console.error("Error:", error.message);
      await message.reply("Sorry, I couldn't process your question at the moment.");
    }
  }
};
