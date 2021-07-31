const _ = require('lodash');

module.exports = {
  name: 'list',
  description: 'Details other `list` commands to help find your bets.',
  enums: ['list'],
  sortWeight: -40,
  disabled: false,
  async execute(msg, args, client) {
    const listCommands = [
      '`!listAll`',
      '`!listActiveBets`',
      '`!listAllActiveBets`',
      '`!listAllNewBets`',
      '`!listNewBets`',
      '`!listNewBetsByMe`',
      '`!listYahooToDo [aggregate]`',
    ];

    return msg.channel.send(
      `Looking for one of these?\n${listCommands.join('\n')}`
    );
  },
};
