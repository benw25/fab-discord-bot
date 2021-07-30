const _ = require('lodash');

const { FaabBet, YahooTeam } = require('../../models');

module.exports = {
  name: 'updateInYahoo',
  description:
    'Signifies that a bet was settled in Yahoo. Use `!listYahooToDo` to get the `betId`',
  enums: ['updateInYahoo'],
  disabled: false,
  argsRequired: true,
  argsUsage: '(betId) (week)',
  async execute(msg, args, client) {
    if (_.size(args) < 2)
      return msg.channel.send(
        `Correct usage is \`!updateInYahoo (betId) (week)\` `
      );

    const betId = args[0];

    const week = _.parseInt(args[1]);
    if (_.isNaN(week)) return msg.channel.send(`${week} is not a validweek)`);

    const managerName = await YahooTeam.getManagerNameByDiscordUserId(
      msg.author.id
    );

    if (managerName !== 'Ben')
      return msg.channel.send(`Sorry, only Ben can use this command.`);

    const unformatted = true;
    const bets = await FaabBet.getAllUnupdatedYahoo(unformatted);

    const foundBet = FaabBet.filterBetById(bets, betId);

    if (!foundBet)
      return msg.channel.send(`Could not find a bet with id \`${betId}\``);

    await foundBet.updatedOnYahoo(week);

    return msg.channel.send(
      `Bet \`${betId}\` updated on Yahoo for ${_.get(
        foundBet,
        'faabAmount'
      )} faab.`
    );
  },
};
