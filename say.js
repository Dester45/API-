const axios = require('axios');

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
    name: "say",
    aliases: ["say"],
    version: "1.0",
    author: "aesther",
    countDown: 5,
    role: 0,
    shortDescription: "Say something",
    longDescription: "",
    category: "Entertainment",
    guide: "{pn} {{<say>}}"
  },

  onStart: async function ({ api, message, args, event }) {
    let lng = "en";
    let say;
    
    if (event.messageReply) {
      say = event.messageReply.body;
    } else if (args.length && ln.includes(args[0])) {
      lng = args[0];
      args.shift();
      say = args.join(" ");
    } else {
      say = args.join(" ");
    }
    
    try {
      const maxLength = 200; // Limite de longueur pour une requête TTS Google Translate
      const chunks = [];
      for (let i = 0; i < say.length; i += maxLength) {
        chunks.push(say.substring(i, i + maxLength));
      }

      for (const chunk of chunks) {
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lng}&client=tw-ob&q=${encodeURIComponent(chunk)}`;
        
        // Envoyer la réponse avec le texte à dire
        await api.sendMessage({
          body: "",
          attachment: await global.utils.getStreamFromURL(url)
        }, event.threadID);
      }

    } catch (e) {
      console.log(e);
      api.sendMessage(`🌊 Erreur de traitement 🌊`, event.threadID);
    }
  }
};
