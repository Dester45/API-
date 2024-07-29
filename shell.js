@cmd install shell.js const { exec } = require('child_process');

module.exports = {
  config: {
    name: "shell",
    version: "1.2",
    author: "Itz Aryan",
    countDown: 5,
    role: 2,
    shortDescription: "Execute shell commands",
    longDescription: "Allows authorized users to execute shell commands securely with input sanitization, output formatting, and command history.",
    category: "owner",
    guide: {
      vi: "{p}{n} <command>",
      en: "{p}{n} <command>"
    }
  },

  onStart: async function ({ args, message, user, event }) {
    const command = args.join(" ");
    if (!command) {
      return message.reply("Please provide a command to execute.");
    }

    executeCommand(command, message);
  }
};

async function executeCommand(command, message) {
  const { exec } = require('child_process');

  try {
    const sanitizedCommand = sanitizeCommand(command);

    const timeoutMs = 10000; // 10 seconds
    const executionPromise = executeWithTimeout(sanitizedCommand, timeoutMs);

    const { stdout, stderr } = await executionPromise;

    if (stderr) {
      console.error(`Command execution resulted in an error: ${stderr}`);
      return message.reply(`Command execution resulted in an error: ${stderr}`);
    }

    message.reply(`Command executed successfully:\n${formatOutput(stdout)}`);
    
    logCommandExecution(command, stdout, stderr);
  } catch (error) {
    console.error(`Error executing command: ${error}`);
    message.reply(`An error occurred while executing the command: ${error.message}`);
  }
}

function sanitizeCommand(command) {
  // Implement your command sanitization logic here (for demonstration, this is basic)
  const sanitizedCommand = command.replace(/[;&|`$(){}\\]/g, '');

  return sanitizedCommand;
}

function formatOutput(output) {
  return output.trim(); // Trim whitespace for cleaner output
}

function executeWithTimeout(command, timeoutMs) {
  return new Promise((resolve, reject) => {
    const process = exec(command, { timeout: timeoutMs }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });

    process.on('timeout', () => {
      process.kill('SIGINT'); // Kill the process on timeout
      reject(new Error(`Command execution timed out after ${timeoutMs / 1000} seconds.`));
    });
  });
}

function logCommandExecution(command, stdout, stderr) {
  console.log(`Executed Command: ${command}`);
  console.log(`Output: ${stdout}`);
  console.error(`Error: ${stderr}`);
}
