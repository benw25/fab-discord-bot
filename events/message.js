const _ = require('lodash');
const Discord = require('discord.js');

const { BOT_COMMAND_PREFIX, DEFAULT_COOLDOWN } = require('../constants');

module.exports = {
  name: 'message',
  execute(msg) {
    const client = _.get(msg, 'client');
    const cooldowns = client.cooldowns;
    const content = _.get(msg, 'content');

    const isFromBot = !!_.get(msg, ['author', 'bot']);
    if (!_.startsWith(content, BOT_COMMAND_PREFIX) || isFromBot) return;

    const args = content.slice(_.size(BOT_COMMAND_PREFIX)).trim().split(/ +/);
    const userInputCommand = _.toLower(args.shift());

    if (!client.commands.has(userInputCommand))
      return msg.channel.send(
        `**${userInputCommand}** is not a valid command.`
      );

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
      command.execute(msg, args, client);
    } catch (error) {
      console.error(error);
      msg.reply(`there was an error trying to execute ${userInputCommand}!`);
    }
  },
};
