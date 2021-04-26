const Discord = require('discord.js');
const _ = require('lodash');
require('dotenv').config();

const {
  BOT_COMMAND_PREFIX,
  DEFAULT_COOLDOWN,
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

client.cooldowns = new Discord.Collection();
const cooldowns = client.cooldowns;

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

  if (!client.commands.has(userInputCommand))
    return msg.channel.send(`**${userInputCommand}** is not a valid command.`);

  const command = client.commands.get(userInputCommand);

  if (command.argsRequired && !args.length) {
    let reply = `You didn't provide any arguments, ${msg.author}!`;

    if (command.argsUsage)
      reply += `\nProper usage: \`${BOT_COMMAND_PREFIX}${command.name} ${command.argsUsage}\``;

    return msg.channel.send(reply);
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || DEFAULT_COOLDOWN) * 1000;

  if (timestamps.has(msg.author.id)) {
    const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return msg.reply(
        `stop spamming bro - please wait ${timeLeft.toFixed(
          2
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }

  timestamps.set(msg.author.id, now);
  setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);

  try {
    command.execute(msg, args);
  } catch (error) {
    console.error(error);
    msg.reply(`there was an error trying to execute ${userInputCommand}!`);
  }
});
