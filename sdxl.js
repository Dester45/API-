@cmd install sdxl.js const axios = require('axios');
module.exports = {
  config: {
    name: 'sdxl',
    aliases: ['img'],
    version: '1',
    author: '𝗔𝗲𝘀𝘁𝗵𝗲𝗿',
    countDown: 10,
    role: 0,
    longDescription: {
      en: 'Text to Image'
    },
    category: 'Image',
    guide: {
      en: `[📑] 𝗦𝗗𝗫𝗟 - 𝗠𝗢𝗗𝗘𝗟 :\n1, 2, 3, 4, 5, 6, 7, 8, 9\n\n𝗘𝗫: {P}𝘀𝗱𝘅𝗹 Naruto 6 `
    }
  },

  onStart: async function ({ message, api, args, event }) {
    const text = args.join(' ');
    
    if (!text) {
      return message.reply("Soraty e");
    }
    
    const [prompt, model] = text.split('|').map((text) => text.trim());
    const puti = model || "2";
    const baseURL = `https://joshweb.click/sdxl?q=${prompt}&style=${puti}`;
    
    const senderID = event.senderID;
      const senderInfo = await api.getUserInfo([senderID]);
      const senderName = senderInfo[senderID].name;
    message.reply("🕙 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗜𝗡𝗚.", async (err, info) => {
      message.reply({ 
body: `🍜 ${senderName} 🍜`,
        attachment: await global.utils.getStreamFromURL(baseURL)
      });
api.setMessageReaction("🔰", event.messageID, () => {}, true);
      let ui = info.messageID;
      message.unsend(ui);
      
    });
  }
};
