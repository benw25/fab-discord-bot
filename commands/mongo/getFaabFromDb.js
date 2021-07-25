const _ = require('lodash');

const {
  getLeagueInfo,
  getFAABBalances,
  getTeamNameAndIds,
} = require('../../yahoo-api');

const { YahooToken, YahooFaab } = require('../../models');

module.exports = {
  // Only use if getFaabFromYahoo can't be used
  name: 'getFaabFromDb',
  description: 'get faab directly from db (does not GET from yahoo)',
  enums: ['getFaabFromDb', 'faabDb'],
  disabled: true,
  async execute(msg, args) {
    const balances = await YahooFaab.getBalances();

    if (typeof balances == 'object')
      msg.channel.send(`\`${JSON.stringify(balances, null, 2)}\``);
    else msg.channel.send(balances);
  },
};
