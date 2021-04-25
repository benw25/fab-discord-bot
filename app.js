const Discord = require('discord.js');
const _ = require('lodash');
require('dotenv').config();

const {
  BOT_COMMAND_PREFIX,
  getParamNames,
  initializeCommandsGrouped,
  initializeAllCommandEnums,
} = require('./constants');

const COMMANDS_DIRECTORY = './commands';

const client = new Discord.Client();

client.commands = new Discord.Collection();
initializeAllCommandEnums(client.commands, COMMANDS_DIRECTORY);

client.commandsGroupedEnums = new Discord.Collection();
initializeCommandsGrouped(client.commandsGroupedEnums, COMMANDS_DIRECTORY);

client.login(process.env.DISCORD_BOT_TOKEN);

client.on('ready', () => {
  console.log('\n*******************');
  console.log(' Bot is CONNECTED!');
  console.log('*******************\n');
});

// client.on('message', (msg) => {
//   if (msg.content === 'Hello') msg.reply('Hi');
// });

client.on('message', (msg) => {
  const content = _.get(msg, 'content');
  const isFromBot = !!_.get(msg, ['author', 'bot']);
  if (!_.startsWith(content, BOT_COMMAND_PREFIX) || isFromBot) return;

  const args = content.slice(_.size(BOT_COMMAND_PREFIX)).trim().split(/ +/);
  const userInputCommand = _.toLower(args.shift());

  // console.log(`Args: ${args}`);

  if (!client.commands.has(userInputCommand))
    return msg.channel.send(`**${userInputCommand}** is not a valid command.`);

  try {
    client.commands.get(userInputCommand).execute(msg, args, client);
  } catch (error) {
    console.error(error);
    msg.reply(`there was an error trying to execute ${userInputCommand}!`);
  }
});
