@cmd install 0restart.js const fs = require("fs-extra");

module.exports = {
  config: {
    name: "restart",
    aliases: ["rdm"],
    version: "1.0",
    author: "𝗔𝗘𝗦𝗧𝗛𝗘𝗥",
    countDown: 5,
    role: 2,
    shortDescription: {
      vi: "Khởi động lại bot",
      en: "Restart bot"
    },
    longDescription: {
      vi: "Khởi động lại bot",
      en: "Restart bot"
    },
    category: "Owner",
    guide: {
      vi: "   {pn}: Khởi động lại bot",
      en: "   {pn}: Restart bot"
    }
  },

  langs: {
    vi: {
      restartting: "𝗥𝗘𝗦𝗧𝗔𝗥𝗧\n[🔴🔵⚪....] "
    },
    en: {
      restartting: "𝗥𝗘𝗦𝗧𝗔𝗥𝗧\n[🔴🔵⚪....] "
    }
  },

  onStart: async function ({ api, message, event, getLang }) {
    const pathFile = `${__dirname}/tmp/restart.txt`;
    // Store image link (replace 'IMAGE_LINK_HERE' with your actual image link)
    const imageLink = "https://i.postimg.cc/GhtYdvjF/20240721-202827.jpg";
    fs.writeFileSync(pathFile, `${event.threadID} ${Date.now()} ${imageLink}`);
    await message.reply(getLang("restartting"));
    process.exit(2);
  },

  onLoad: function ({ api }) {
    const pathFile = `${__dirname}/tmp/restart.txt`;
    if (fs.existsSync(pathFile)) {
      const [tid, time, imageLink] = fs.readFileSync(pathFile, "utf-8").split(" ");
      api.sendMessage(
        `✔️ ××𝙎𝙐𝘾𝘾𝙀𝙎𝙎××\n━━━━━━━━━━━━\n✦ 🛄 𝗕𝗢𝗧 restarted :\n✦﹝⏱️TIME﹞: ${(Date.now() - time) / 1000}s🚀\n✦ Image Link: ${imageLink}`,
        tid
      );
      fs.unlinkSync(pathFile);
    }
  }
};
