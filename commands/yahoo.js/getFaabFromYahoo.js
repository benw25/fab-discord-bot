const _ = require('lodash');

const { YahooFaab } = require('../../models');

module.exports = {
  name: 'faab',
  description: 'get faab from Yahoo',
  enums: ['faab', 'getFaabFromYahoo', 'faabBalance', 'balance'],
  sortWeight: -60,
  async execute(msg, args) {
    // let didSync = false;

    try {
      await YahooFaab.sync();
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
