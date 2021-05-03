const _ = require('lodash');

const {
  // getInitialAuthFullRoute,
  // postInitialAuthorization,
  getLeagueInfo,
} = require('../../yahoo-api');

const { YahooToken } = require('../../models');

module.exports = {
  name: 'test',
  description: 'tests yahoo commands',
  enums: ['test'],
  async execute(msg, args) {
    // only needs to be run once per client

    // console.log(getInitialAuthFullRoute());
    // const a = await postInitialAuthorization();
    // console.log(a);

    const token = await YahooToken.getOrCreateMostRecentToken();

    // msg.channel.send(token);

    const leagueInfo = await getLeagueInfo(token);
    msg.channel.send(`\`${JSON.stringify(leagueInfo, null, 2)}\``);
  },
};
