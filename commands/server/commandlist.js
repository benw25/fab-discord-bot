const _ = require('lodash');

const { BOT_COMMAND_PREFIX, DEFAULT_COOLDOWN } = require('../../constants');

// use sortWeight in individual command to update sorting in simpleCommands
const SIMPLE_COMMANDS_LIST = [
  'link',
  'linkInfo',
  'bet',
  'accept',
  'reject',
  'resolve',
  'faab',
  'help',
  'list',
];

async function listCommandsSimple(commands, msg) {
  const commandArray = commands.array();

  const sortedArray = _.sortBy(commandArray, ['sortWeight', 'name']);

  let message = [];
  message.push("Here's a list of the most relevant commands:\n");

  _.forEach(sortedArray, (c) => {
    const { name, description, enums } = c;

    if (_.includes(SIMPLE_COMMANDS_LIST, name)) {
      let argsUsage = _.get(c, 'argsUsage', '');
      if (argsUsage) argsUsage = ' ' + argsUsage;

      let aliases = _.sortBy(_.without(enums, name));
      aliases = _.map(aliases, (v) => `${BOT_COMMAND_PREFIX}${v}`);

      let aliasesMessage = '';
      if (!_.isEmpty(aliases)) {
        aliasesMessage = ` Aliases: _${_.join(aliases, ', ')}_\n`;
      }

      message.push(
        `\`${BOT_COMMAND_PREFIX}${name}${argsUsage}\` - ${description}\n\t${aliasesMessage}`
      );
    }
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

    let aliasesMessage = '';
    if (!_.isEmpty(aliases)) {
      aliasesMessage = ` Aliases: _${_.join(aliases, ', ')}_\n`;
    }

    message.push(
      `\`${BOT_COMMAND_PREFIX}${name}${argsUsage}\` - ${description}\n\t${aliasesMessage}`
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
  description:
    'lists the most used bot commands. Can also lists all bot commands (`!help all`) or info about a specific command',
  enums: ['help', 'c', 'commandList', 'command', 'commands', 'info'],
  sortWeight: -50,
  async execute(msg, args) {
    if (!_.size(args)) {
      await listCommandsSimple(msg.client.commandsGroupedEnums, msg);
      return;
    }

    const commandName = _.toLower(args[0]);

    if (commandName == 'all') {
      await listAllCommands(msg.client.commandsGroupedEnums, msg);
      return;
    }

    await listIndividualCommand(commandName, msg.client.commands, msg);
  },
};
