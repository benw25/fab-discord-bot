const _ = require('lodash');

module.exports = {
  name: 'list',
  description: 'Provides a command of `list` commands.',
  enums: ['list'],
  disabled: false,
  async execute(msg, args, client) {
    const listCommands = [
      '`!listActiveBets`',
      '`!listAllActiveBets`',
      '`!listAllNewBets`',
      '`!listNewBets`',
      '`!listNewBetsByMe`',
      '`!listYahooToDo`',
    ];

    return msg.channel.send(
      `Did you mean one of these?\n${listCommands.join('\n')}`
    );
  },
};
