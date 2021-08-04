const _ = require('lodash');

const { FaabBet, YahooTeam } = require('../../models');

const ADMIN_MANAGERS = ['Ben', 'Dave', 'Jerry'];
const ADMIN_MANAGERS_JOINED = _.join(ADMIN_MANAGERS, ', ');

module.exports = {
  name: 'updateInYahoo',
  description: `Signifies that a bet was settled in Yahoo. Use \`!listYahooToDo\` to get the \`betId\`, currently limited to ${ADMIN_MANAGERS_JOINED}`,
  enums: ['updateInYahoo'],
  disabled: false,
  argsRequired: true,
  argsUsage: '(betId or all) (week)',
  async execute(msg, args, client) {
    if (_.size(args) < 2)
      return msg.channel.send(
        `Correct usage is \`!updateInYahoo (betId) (week)\` `
      );

    const betId = args[0];
    const resolveAll = args[0] && _.startsWith(args[0], 'a');

    const week = _.parseInt(args[1]);
    if (_.isNaN(week)) return msg.channel.send(`${week} is not a validweek)`);

    const managerName = await YahooTeam.getManagerNameByDiscordUserId(
      msg.author.id
    );

    if (!_.includes(ADMIN_MANAGERS, managerName))
      return msg.channel.send(
        `Sorry, only ${ADMIN_MANAGERS_JOINED} can use this command.`
      );

    const unformatted = true;
    const bets = await FaabBet.getAllUnupdatedYahoo(unformatted);

    if (!resolveAll) {
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
    } else {
      let resolvedBetCount = 0;
      for (let bet of bets) {
        await bet.updatedOnYahoo(week);

        resolvedBetCount++;
      }

      return msg.channel.send(
        `Marked \`${resolvedBetCount}\` bets as updated on Yahoo for week ${week}.`
      );
    }
  },
};
