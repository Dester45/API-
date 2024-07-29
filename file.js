const fs = require('fs');
const path = require('path');

module.exports = {
	config: {
		name: "file",
		aliases: ["files"],
		version: "1.1",
		author: "Mahir Tahsan",
		countDown: 5,
		role: 0,
		shortDescription: "Send a bot script file",
		longDescription: "Send the content of a specified bot script file.",
		category: "𝗢𝗪𝗡𝗘𝗥",
		guide: "{pn} file <filename>. Ex: {pn} file scriptName"
	},

	onStart: async function ({ message, args, api, event }) {
		const allowedUsers = ["61555882584314"];
		if (!allowedUsers.includes(event.senderID)) {
			return api.sendMessage("You don't have permission to use this command.", event.threadID, event.messageID);
		}

		const fileName = args[0];
		if (!fileName) {
			return api.sendMessage("Please provide the name of the file you want to access.", event.threadID, event.messageID);
		}

		const filePath = path.join(__dirname, `${fileName}.js`);
		if (!fs.existsSync(filePath)) {
			return api.sendMessage(`The file "${fileName}.js" was not found.`, event.threadID, event.messageID);
		}

		try {
			const fileContent = fs.readFileSync(filePath, 'utf8');
			api.sendMessage({ body: fileContent }, event.threadID);
		} catch (error) {
			api.sendMessage("An error occurred while reading the file.", event.threadID, event.messageID);
			console.error(`Error reading file ${filePath}:`, error);
		}
	}
};
