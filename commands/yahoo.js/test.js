const _ = require('lodash');

const {
  getLeagueInfo,
  getFAABBalances,
  getTeamNameAndIds,
} = require('../../yahoo-api');

const { YahooToken, YahooFaab } = require('../../models');

module.exports = {
  name: 'test',
  description: 'tests yahoo commands',
  enums: ['test'],
  async execute(msg, args) {
    const token = await YahooToken.getOrCreateMostRecentToken();

    //     const leagueInfo = await getLeagueInfo(token);
    //     console.log(leagueInfo);
    //     msg.channel.send(`\`${JSON.stringify(leagueInfo, null, 2)}\``);

    // const balances = await getFAABBalances(token);
    // console.log(balances);

    await YahooFaab.sync();
    const balances = await YahooFaab.getBalances();
    console.log(balances);
  },
};
