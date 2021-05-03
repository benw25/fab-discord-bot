const _ = require('lodash');

const { getLeagueInfo } = require('../../yahoo-api');

const { YahooToken } = require('../../models');

module.exports = {
  name: 'test',
  description: 'tests yahoo commands',
  enums: ['test'],
  async execute(msg, args) {
    const token = await YahooToken.getOrCreateMostRecentToken();

    const leagueInfo = await getLeagueInfo(token);
    msg.channel.send(`\`${JSON.stringify(leagueInfo, null, 2)}\``);
  },
};
