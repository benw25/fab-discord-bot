const _ = require('lodash');

const { FaabBet } = require('../../models');

module.exports = {
  name: 'listNewBets',
  description:
    'Lists your new bets (bets that have been proposed to you that have not yet been accepted or rejected).',
  enums: ['listNewBets', 'listBetsNew'],
  disabled: false,
  async execute(msg, args, client) {
    const unformatted = false;
    const includeOpenBets = true;
    const bets = await FaabBet.getAllUnacceptedBetsOfferedToDiscordUserId(
      msg.author.id,
      unformatted,
      includeOpenBets
    );

    if (_.isEmpty(bets))
      return msg.channel.send('You have no unaccepted bets proposed to you.');
    return msg.channel.send(bets);
  },
};
