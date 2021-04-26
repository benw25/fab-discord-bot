const _ = require('lodash');

const { BOT_COMMAND_PREFIX } = require('../../constants');

function listAllCommands(commands, msg) {
  const commandArray = commands.array();

  const sortedArray = _.sortBy(commandArray, ['name']);

  let message = '';
  _.forEach(sortedArray, (c) => {
    const { name, description, enums } = c;
    let argsUsage = _.get(c, 'argsUsage', '');
    if (argsUsage) argsUsage = ' ' + argsUsage;

    let aliases = _.sortBy(_.without(enums, name));
    aliases = _.map(aliases, (v) => `${BOT_COMMAND_PREFIX}${v}`);

    message += `\`${BOT_COMMAND_PREFIX}${name}${argsUsage}\` - ${description}\n\t Aliases: _${
      _.join(aliases, ', ') || '(none)'
    }_\n\n`;
  });

  msg.channel.send(message);
}

module.exports = {
  name: 'commandlist',
  description: 'lists all bot commands',
  enums: ['c', 'commandList', 'commands', 'help', 'info'],
  execute(msg, args, client) {
    listAllCommands(client.commandsGroupedEnums, msg);
  },
};
