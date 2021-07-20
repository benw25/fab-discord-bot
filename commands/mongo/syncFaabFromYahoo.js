const _ = require('lodash');
const moment = require('moment');
require('dotenv').config();

const { YahooFaab } = require('../../models');

module.exports = {
  name: 'syncFaab',
  description: 'syncs faab balance from yahoo snapshot',
  enums: ['syncFaab', 'sync'],
  disabled: false,
  async execute(msg) {
    const didPopulate = await YahooFaab.sync();

    if (didPopulate) msg.channel.send('created new Faab Snapshot!!');
    else msg.channel.send('could not create Faab Snapshot.');
  },
};
