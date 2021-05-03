const _ = require('lodash');

const { getLeagueInfo, getFAABBalances } = require('../../yahoo-api');

const { YahooToken } = require('../../models');

module.exports = {
  name: 'test',
  description: 'tests yahoo commands',
  enums: ['test'],
  async execute(msg, args) {
    const token = await YahooToken.getOrCreateMostRecentToken();

    //     const leagueInfo = await getLeagueInfo(token);
    //     console.log(leagueInfo);
    //     msg.channel.send(`\`${JSON.stringify(leagueInfo, null, 2)}\``);

    const balances = await getFAABBalances(token);
    console.log(balances);
  },
};
