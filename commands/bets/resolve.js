const _ = require('lodash');

const { FaabBet } = require('../../models');

module.exports = {
  name: 'resolve',
  description: 'Resolves a bet. Use !listActiveBets to find bets to resolve',
  enums: ['resolve'],
  disabled: false,
  argsRequired: true,
  argsUsage: '(betId)  (winnerName)',
  async execute(msg, args, client) {
    if (_.size(args) < 2)
      return msg.channel.send(
        `Correct usage is \`!resolve (betId) (winnerName)\` `
      );

    const betId = args[0];
    const winningManagerName = _.capitalize(args[1]);

    const unformatted = true;
    const userBets = await FaabBet.getAllActiveBetsToOrByDiscordUserId(
      msg.author.id,
      unformatted
    );

    const foundBet = FaabBet.filterBetById(userBets, betId);

    if (!foundBet)
      return msg.channel.send(
        `Could not find an unresolved bet with id \`${betId}\``
      );

    let newMessage = await foundBet.resolveBet(winningManagerName, client);

    if (!newMessage) newMessage = 'Something went wrong';
    return msg.channel.send(newMessage);
  },
};
