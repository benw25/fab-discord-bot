const _ = require('lodash');

const { FaabBet } = require('../../models');

module.exports = {
  name: 'listUnupdatedYahoo',
  description: 'Lists bets that need to be updated in Yahoo.',
  enums: ['listUnupdatedYahoo', 'listYahooToDo', 'listToDoYahoo'],
  disabled: false,
  async execute(msg, args, client) {
    const bets = await FaabBet.getAllUnupdatedYahoo();

    if (_.isEmpty(bets)) return msg.channel.send('No bets to update in Yahoo.');
    return msg.channel.send(bets);
  },
};
