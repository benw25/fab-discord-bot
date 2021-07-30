const _ = require('lodash');

const { FaabBet } = require('../../models');

module.exports = {
  name: 'listActiveBets',
  description: 'Lists active bets that have yet to be resolved.',
  enums: ['listActiveBets', 'listActive', 'listBetsToResolve'],
  disabled: false,
  async execute(msg, args, client) {
    const bets = await FaabBet.getAllActiveBetsToOrByDiscordUserId(
      msg.author.id
    );

    if (_.isEmpty(bets))
      return msg.channel.send('You have no unresolved bets.');
    return msg.channel.send(bets);
  },
};
