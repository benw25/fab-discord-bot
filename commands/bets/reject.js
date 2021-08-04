const _ = require('lodash');

const { FaabBet } = require('../../models');

module.exports = {
  name: 'reject',
  description: 'Rejects a bet.',
  enums: ['reject'],
  sortWeight: -80,
  disabled: false,
  argsRequired: true,
  argsUsage: '(betId)',
  async execute(msg, args, client) {
    if (_.size(args) < 1)
      return msg.channel.send(`Correct usage is \`!reject (betId)\` `);

    const betId = args[0];

    const unformatted = true;
    const includeOpenBets = false;
    const betsToUser = await FaabBet.getAllUnacceptedBetsOfferedToDiscordUserId(
      msg.author.id,
      unformatted,
      includeOpenBets
    );

    const betsByUser = await FaabBet.getAllUnacceptedBetsOfferedByDiscordUserId(
      msg.author.id,
      unformatted
    );

    const foundBet = FaabBet.filterBetById(
      [...betsToUser, ...betsByUser],
      betId
    );

    if (!foundBet)
      return msg.channel.send(
        `Could not find an unaccepted bet with id \`${betId}\``
      );

    await foundBet.rejectBet(msg.author.id, client);

    // TODO: return the message from the instance method instead
    return msg.channel.send(
      `Bet \`${betId}\` rejected!\n**${_.get(foundBet, 'description')}**`
    );
  },
};
