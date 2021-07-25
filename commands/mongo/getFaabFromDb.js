const _ = require('lodash');

const {
  getLeagueInfo,
  getFAABBalances,
  getTeamNameAndIds,
} = require('../../yahoo-api');

const { YahooToken, YahooFaab } = require('../../models');

module.exports = {
  name: 'getFaabFromDb',
  description: 'get faab directly from db (does not GET from yahoo)',
  enums: ['getFaabFromDb', 'faabDb'],
  async execute(msg, args) {
    // let didSync = false;

    try {
      await YahooFaab.sync(); // will Test with auto sync first
      // didSync = true;
      console.log('Synced db with Yahoo!');
    } catch (e) {
      console.log('Sync failed, pulling unsynced...');
    }

    const balances = await YahooFaab.getBalances();

    if (typeof balances == 'object')
      msg.channel.send(`\`${JSON.stringify(balances, null, 2)}\``);
    else msg.channel.send(balances);
  },
};
