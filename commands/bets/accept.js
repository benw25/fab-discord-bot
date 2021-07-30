const _ = require('lodash');

const { FaabBet } = require('../../models');

module.exports = {
  name: 'accept',
  description: 'Accepts a bet. Use `!listNewBets` to get the `betId`',
  enums: ['accept'],
  disabled: false,
  argsRequired: true,
  argsUsage: '(betId)',
  async execute(msg, args, client) {
    if (_.size(args) < 1)
      return msg.channel.send(`Correct usage is \`!accept (betId)\` `);

    const betId = args[0];

    const unformatted = true;
    const bets = await FaabBet.getAllUnacceptedBetsOfferedToDiscordUserId(
      msg.author.id,
      unformatted
    );

    const foundBet = FaabBet.filterBetById(bets, betId);

    if (!foundBet)
      return msg.channel.send(
        `Could not find an unaccepted bet with id \`${betId}\``
      );

    await foundBet.acceptBet(client);

    return msg.channel.send(
      `Bet \`${betId}\` accepted!\nDescription: ${_.get(
        foundBet,
        'description'
      )}\n(You are on the opposite side)`
    );
  },
};
