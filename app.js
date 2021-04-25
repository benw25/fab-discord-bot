const Discord = require('discord.js');
const _ = require('lodash');
require('dotenv').config();

const { BOT_COMMAND_ENUMS, JOKES, getParamNames } = require('./constants');

const client = new Discord.Client();

const BOT_COMMAND_PREFIX = '!';

client.login(process.env.DISCORD_BOT_TOKEN);

client.on('ready', () => {
  console.log('\n*******************');
  console.log(' Bot is CONNECTED!');
  console.log('*******************\n');
  console.log(`All bot commands:\n`);
  console.log(BOT_COMMAND_ENUMS);
});

client.on('message', (msg) => {
  if (msg.content === 'Hello') msg.reply('Hi');
});

client.on('message', (msg) => {
  const content = _.get(msg, 'content');
  if (!_.startsWith(content, BOT_COMMAND_PREFIX)) {
    // normal message
    return;
  }

  const newBotMessage = new discordBotMessage(content);

  if (newBotMessage.matchesBotCommand(BOT_COMMAND_ENUMS.JOKE)) {
    const jokesArrayIndex = _.random(0, _.size(JOKES) - 1);
    msg.channel.send(JOKES[jokesArrayIndex]);
  } else {
    msg.channel.send(
      `**${_.get(newBotMessage, 'discordMessage')}** is not a valid command.`
    );
  }
});

class discordBotMessage {
  constructor(message) {
    this.discordMessage = message;
    this.lowercaseMessage = _.toLower(message);
  }

  matchesBotCommand(botCommands) {
    if (!_.size(botCommands)) {
      console.log(`ERROR: no botCommands for function matchesBotCommand.`);
      return false;
    } else if (!this.discordMessage) {
      console.log(`ERROR: no message for function matchesBotCommand.`);
      return false;
    }

    const fullEnumsForCommands = _.map(
      botCommands,
      (c) => `${BOT_COMMAND_PREFIX}${c}`
    );

    return _.includes(fullEnumsForCommands, this.lowercaseMessage);
  }
}
