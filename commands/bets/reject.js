const _ = require('lodash');

const { FaabBet } = require('../../models');

module.exports = {
  name: 'reject',
  description: 'Rejects a bet.',
  enums: ['reject'],
  disabled: false,
  argsRequired: true,
  argsUsage: '(betId)',
  async execute(msg, args, client) {
    if (_.size(args) < 1)
      return msg.channel.send(`Correct usage is \`!reject (betId)\` `);

    const betId = args[0];

    const unformatted = true;
    const betsToUser = await FaabBet.getAllUnacceptedBetsOfferedToDiscordUserId(
      msg.author.id,
      unformatted
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

    await foundBet.rejectBet(msg.author.id);
    // TODO: message proposer

    return msg.channel.send(
      `Bet \`${betId}\` rejected!\nDescription: ${_.get(
        foundBet,
        'description'
      )}`
    );
  },
};
