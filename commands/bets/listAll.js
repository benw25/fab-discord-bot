const _ = require('lodash');

const { FaabBet } = require('../../models');

module.exports = {
  name: 'listAll',
  description: 'Lists all pending and active bets that you are involved in.',
  enums: ['listAll', 'listAllBets'],
  disabled: false,
  async execute(msg, args, client) {
    const bets = await FaabBet.getBetsToOrByDiscordUserId(msg.author.id);

    if (_.isEmpty(bets)) return msg.channel.send('You have no bets.');
    return msg.channel.send(bets);
  },
};
