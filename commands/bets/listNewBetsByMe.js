const _ = require('lodash');

const { FaabBet } = require('../../models');

module.exports = {
  name: 'listNewBetsByMe',
  description: `Lists new bets that you've proposed that have not yet been accepted or rejected.`,
  enums: ['listNewBetsByMe', 'listBetsToRescind'],
  disabled: false,
  async execute(msg, args, client) {
    const bets = await FaabBet.getAllUnacceptedBetsOfferedByDiscordUserId(
      msg.author.id
    );

    if (_.isEmpty(bets))
      return msg.channel.send('You have no unaccepted bets proposed by you.');
    return msg.channel.send(bets);
  },
};
