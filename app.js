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
  console.log(JSON.stringify(BOT_COMMAND_ENUMS, null, 2));
});

client.on('message', (msg) => {
  if (msg.content === 'Hello') msg.reply('Hi');
});

client.on('message', (msg) => {
  const content = _.get(msg, 'content');
  const isFromBot = !!_.get(msg, ['author', 'bot']);
  if (!_.startsWith(content, BOT_COMMAND_PREFIX || isFromBot)) return;

  const args = content.slice(_.size(BOT_COMMAND_PREFIX)).trim().split(/ +/);
  const userInputCommand = _.toLower(args.shift());

  console.log(args);

  const { JOKE, SERVER, USER_INFO, COMMANDS } = BOT_COMMAND_ENUMS;

  if (matchesBotCommand(userInputCommand, JOKE)) {
    const jokesArrayIndex = _.random(0, _.size(JOKES) - 1);
    msg.channel.send(JOKES[jokesArrayIndex]);
  } else if (matchesBotCommand(userInputCommand, SERVER)) {
    msg.channel.send(
      `This server's name is: ${_.get(msg, [
        'guild',
        'name',
      ])}\nTotal members: ${_.get(msg, ['guild', 'memberCount'])}`
    );
  } else if (matchesBotCommand(userInputCommand, USER_INFO)) {
    msg.channel.send(
      `Your username: ${msg.author.username}\nYour ID: ${msg.author.id}`
    );
  } else if (matchesBotCommand(userInputCommand, COMMANDS)) {
    msg.channel.send(`${JSON.stringify(BOT_COMMAND_ENUMS, null, 2)}`);
  } else {
    msg.channel.send(`**${userInputCommand}** is not a valid command.`);
  }
});

const matchesBotCommand = (userInputCommand, botCommand) => {
  if (!_.size(botCommand)) {
    console.log(`ERROR: no botCommand for function matchesBotCommand.`);
    return false;
  } else if (!userInputCommand) {
    console.log(`ERROR: no userInputCommand for function matchesBotCommand.`);
    return false;
  }

  const fullEnumsForBotCommands = _.map(botCommand, (c) => _.toLower(c));

  return _.includes(fullEnumsForBotCommands, userInputCommand);
};
