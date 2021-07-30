const _ = require('lodash');

const { BOT_COMMAND_PREFIX, DEFAULT_COOLDOWN } = require('../../constants');

async function listAllCommands(commands, msg) {
  const commandArray = commands.array();

  const sortedArray = _.sortBy(commandArray, ['name']);

  let message = [];
  message.push("Here's a list of all the commands:\n");

  _.forEach(sortedArray, (c) => {
    const { name, description, enums } = c;
    let argsUsage = _.get(c, 'argsUsage', '');
    if (argsUsage) argsUsage = ' ' + argsUsage;

    let aliases = _.sortBy(_.without(enums, name));
    aliases = _.map(aliases, (v) => `${BOT_COMMAND_PREFIX}${v}`);

    message.push(
      `\`${BOT_COMMAND_PREFIX}${name}${argsUsage}\` - ${description}\n\t Aliases: _${
        _.join(aliases, ', ') || '(none)'
      }_\n`
    );
  });

  try {
    await msg.author.send(message, { split: true });
    // msg.reply(message, { split: true });

    if (msg.channel.type != 'dm')
      msg.reply(`I've sent you a DM with more info about the bot commands.`);
  } catch (e) {
    console.error(`Could not send help DM to ${msg.author.tag}.\n`, e);
    msg.reply("It seems like I can't DM you...do you have DMs disabled?");
  }
}

async function listIndividualCommand(commandName, commands, msg) {
  const command = commands.get(commandName);

  if (!command) {
    return msg.reply(`${commandName} is not a valid command`);
  }

  const data = [];
  data.push(`**Name:** \`${command.name}\``);
  let aliases = _.sortBy(_.without(command.enums, command.name));
  aliases = _.map(aliases, (v) => `_${BOT_COMMAND_PREFIX}${v}_`);
  aliases = _.join(aliases, ', ');

  if (command.enums) data.push(`**Aliases:** ${aliases}`);
  if (command.description) data.push(`**Description:** ${command.description}`);
  if (command.argsUsage)
    data.push(
      `**Usage:** \`${BOT_COMMAND_PREFIX}${command.name} ${command.argsUsage}\``
    );

  data.push(`**Cooldown:** ${command.cooldown || DEFAULT_COOLDOWN} second(s)`);

  msg.channel.send(data, { split: true });
}

module.exports = {
  name: 'help',
  description: 'lists all bot commands or info about a specific command',
  enums: ['help', 'c', 'commandList', 'command', 'commands', 'info'],
  argsUsage: '[commandName]',
  async execute(msg, args) {
    if (!_.size(args)) {
      await listAllCommands(msg.client.commandsGroupedEnums, msg);
      return;
    }

    const commandName = _.toLower(args[0]);
    await listIndividualCommand(commandName, msg.client.commands, msg);
  },
};
