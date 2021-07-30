const _ = require('lodash');

const { FaabBet } = require('../../models');

module.exports = {
  name: 'listNewBetsAll',
  description: 'Lists all new bets (not yet been accepted or rejected).',
  enums: ['listNewBetsAll', 'listAllBetsNew', 'listAllNewBets'],
  disabled: false,
  async execute(msg, args, client) {
    const bets = await FaabBet.getAllUnacceptedBets();

    if (_.isEmpty(bets))
      return msg.channel.send('There are no unaccepted bets.');
    return msg.channel.send(bets);
  },
};
