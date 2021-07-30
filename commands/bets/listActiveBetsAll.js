const _ = require('lodash');

const { FaabBet } = require('../../models');

module.exports = {
  name: 'listActiveBetsAll',
  description: 'Lists all active bets that have yet to be resolved.',
  enums: ['listAllActiveBets', 'listAllActive'],
  disabled: false,
  async execute(msg, args, client) {
    const bets = await FaabBet.getAllActiveBets();

    if (_.isEmpty(bets))
      return msg.channel.send('There are no unresolved bets.');
    return msg.channel.send(bets);
  },
};
