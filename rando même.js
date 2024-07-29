@cmd install randomeme.js module.exports = {
  config: {
    name: "randomeme",
    aliases: ["memes"],
    version: "1.0.1",
    author: "aesther",
    countDown: 12,
    role: 0,
    shortDescription: "get anime image memes",
    longDescription: "get random anime images memes",
    category: "Fun",
    guide: "{pn} randomeme",
  },
  onStart: async function ({ api, event }) {
    const axios = require('axios');
    const request = require('request');
    const fs = require("fs");

    try {
      const response = await axios.get('https://nash-rest-api.vercel.app/random-meme');
      const ext = response.data.url.substring(response.data.url.lastIndexOf(".") + 1);

      const callback = function () {
        api.sendMessage({
          body: response.data.name,
          attachment: fs.createReadStream(__dirname + `/cache/codm.${ext}`)
        }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/codm.${ext}`));
      };

      request(response.data.url).pipe(fs.createWriteStream(__dirname + `/cache/codm.${ext}`)).on("close", callback);
    } catch (err) {
      api.sendMessage("API dead", event.threadID);
      api.setMessageReaction("❌", event.messageID, (err) => {}, true);
    }
  }
};
