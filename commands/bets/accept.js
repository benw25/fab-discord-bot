const _ = require('lodash');

const { FaabBet } = require('../../models');

module.exports = {
  name: 'accept',
  description: 'Accepts a bet. Use `!listNewBets` to get the `betId`',
  enums: ['accept'],
  sortWeight: -90,
  disabled: false,
  argsRequired: true,
  argsUsage: '(betId)',
  async execute(msg, args, client) {
    if (_.size(args) < 1)
      return msg.channel.send(`Correct usage is \`!accept (betId)\` `);

    const betId = args[0];

    const unformatted = true;
    const includeOpenBets = true;
    const bets = await FaabBet.getAllUnacceptedBetsOfferedToDiscordUserId(
      msg.author.id,
      unformatted,
      includeOpenBets
    );

    const foundBet = FaabBet.filterBetById(bets, betId);

    if (!foundBet)
      return msg.channel.send(
        `Could not find your unaccepted bet with id \`${betId}\``
      );

    const messageToSend = await foundBet.acceptBet(msg.author.id, client);

    return msg.channel.send(messageToSend);
  },
};
