@cmd install prefix.js const { config } = global.GoatBot;
const path = require("path");
const fs = require("fs-extra");
const { utils } = global;
const axios = require("axios");

module.exports = {
  config: {
    name: "prefix",
    version: "2",
    author: "aesther",
    countDown: 2,
    role: 0,
    shortDescription: "Show prefix Bot",
    longDescription: "command to show the bot Prefix",
    category: "config",

  langs: {
    en: {
      reset: "Your prefix has been reset to default: %1",
      onlyAdmin: "Only admin can change prefix of system bot",
      confirmGlobal: "Please react to this message to confirm change prefix of system bot",
      confirmThisThread: "Please react to this message to confirm change prefix in your box chat",
      successGlobal: "Changed prefix of system bot to: %1",
      successThisThread: "Changed prefix in your group chat to: %1",
      myPrefix:"✎𝙰𝙴𝚂𝚃𝙷𝙴𝚁©/𝙋𝙍𝙀𝙁𝙄𝙓✎:\n┏━━━•━━━•━━━┓\n  🌐--(　・ω・)⊃--[%2]\n┗━━━•━━━•━━━┛\n[🆔]𝙇𝙄𝙉𝙆 𝘼𝘿𝙈𝙄𝙉:\nhttps://www.facebook.com/profile.php?id=61555882584314"
    }
  },

  onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
    if (!args[0])
      return message.SyntaxError();

    if (args[0] == 'reset') {
      await threadsData.set(event.threadID, null, "data.prefix");
      return message.reply(getLang("reset", global.GoatBot.config.prefix));
    }
    else if (args[0] == "file")
    {
      const isAdmin = config.adminBot.includes(event.senderID);
      if (!isAdmin)
      {
        message.reply("❌ You need to be an admin of the bot.");
      }
      else 
      {
        const fileUrl = event.messageReply && event.messageReply.attachments[0].url;

        if (!fileUrl) {
          return message.reply("❌ No valid attachment found.");
        }

        const folderPath = 'scripts/cmds/prefix';

        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
        }

        try {
          const files = await fs.readdir(folderPath);
          for (const file of files) {
            await fs.unlink(path.join(folderPath, file));
          }
        } catch (error) {
          return message.reply("❌ Error clearing folder: " + error);
        }

        const response = await axios.get(fileUrl, {
          responseType: "arraybuffer",
          headers: {
            'User-Agent': 'axios'
          }
        });

        const contentType = response.headers['content-type'];
        if (contentType.includes('image')) {
          const imagePath = path.join(folderPath, 'image.jpg');
          fs.writeFileSync(imagePath, Buffer.from(response.data, 'binary'));
        } else if (contentType.includes('video') || contentType.includes('gif')) {
          const ext = contentType.includes('video') ? '.mp4' : '.gif';
          const mediaPath = path.join(folderPath, 'media' + ext);
          fs.writeFileSync(mediaPath, Buffer.from(response.data, 'binary'));
        } else {
          return message.reply("❌ Invalid attachment format. Reply only with an image, video, or gif");
        }

        message.reply("✅ File saved successfully.");
      }
    }
    else if (args == "clear")
    {			const isAdmin = config.adminBot.includes(event.senderID);
      if (!isAdmin)
      {
        message.reply("❌ You need to be an admin of the bot.");
      }
      else{
        try {
          const folderPath = 'scripts/cmds/prefix';

          if (fs.existsSync(folderPath)) {
            const files = await fs.readdir(folderPath);
            for (const file of files) {
              await fs.unlink(path.join(folderPath, file));
            }
            message.reply("✅ Folder cleared successfully.");
          } else {
            return message.reply("❌ Folder does not exist.");
          }
        } catch (error) {
          return message.reply("❌ Error clearing folder: " + error);
        }
      }
    }

    const newPrefix = args[0];
    const formSet = {
      commandName,
      author: event.senderID,
      newPrefix
    };

    if (args[1] === "-g")
      if (role < 2)
        return message.reply(getLang("onlyAdmin"));
      else
        formSet.setGlobal = true;
    else
      formSet.setGlobal = false;

    return message.reply(args[1] === "-g" ? getLang("confirmGlobal") : getLang("confirmThisThread"), (err, info) => {
      formSet.messageID = info.messageID;
      global.GoatBot.onReaction.set(info.messageID, formSet);
    });
  },

  onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
    const { author, newPrefix, setGlobal } = Reaction;
    if (event.userID !== author)
      return;
    if (setGlobal) {
      global.GoatBot.config.prefix = newPrefix;
      fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
      return message.reply(getLang("successGlobal", newPrefix));
    }
    else {
      await threadsData.set(event.threadID, newPrefix, "data.prefix");
      return message.reply(getLang("successThisThread", newPrefix));
    }
  },

  onChat: async function ({ event, message, getLang }) {
    const folderPath = 'scripts/cmds/prefix';

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const files = await fs.readdir(folderPath);

        const attachments = [];

        for (const file of files) {
        const filePath = path.join(folderPath, file);
        const fileStream = fs.createReadStream(filePath);
        attachments.push(fileStream);
        }

        const messageContent = {
        attachment: attachments
        };

    if (event.body) {
      // List of prefixes to check
      const prefixesToCheck = ["signe", "pfx", "prefix"];

      // Normalize the message to lowercase for case-insensitive matching
      const lowercasedMessage = event.body.toLowerCase();

      // Check if the message is in the list of prefixes
      if (prefixesToCheck.includes(lowercasedMessage.trim())) {
      return () => {
        return message.reply({ body: getLang("myPrefix", global.GoatBot.config.prefix, utils.getPrefix(event.threadID) ), attachment: messageContent.attachment});
      };
      }
    }
    }
};
