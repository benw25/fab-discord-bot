const _ = require('lodash');

const {
  getLeagueInfo,
  getFAABBalances,
  getTeamNameAndIds,
} = require('../../yahoo-api');

const { YahooToken, YahooFaab, YahooTeam, FaabBet } = require('../../models');

module.exports = {
  name: 'test',
  description: 'tests yahoo commands',
  enums: ['test'],
  disabled: false,
  async execute(msg, args, client) {
    const token = await YahooToken.getOrCreateMostRecentToken();

    //     const leagueInfo = await getLeagueInfo(token);
    //     console.log(leagueInfo);
    //     msg.channel.send(`\`${JSON.stringify(leagueInfo, null, 2)}\``);

    // const balances = await getFAABBalances(token);
    // console.log(balances);

    const bets = await FaabBet.getAllUnacceptedBetsOfferedToDiscordUserId(
      msg.author.id
    );
    console.log(bets);

    // const newBet = await FaabBet.createNewFaabBet(
    //   'Ben',
    //   'Dean',
    //   '2',
    //   'testBet'
    // );
    // console.log(newBet);
  },
};
