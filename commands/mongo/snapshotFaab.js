const _ = require('lodash');
const moment = require('moment');
require('dotenv').config();

const { YahooFaabSnapshot } = require('../../models');

module.exports = {
  name: 'snapshotFaab',
  description: 'takes a snapshot of the current faab balance',
  enums: ['snapshot, snapshotFaab'],
  disabled: true,
  async execute(msg) {
    const didPopulate = await YahooFaabSnapshot.createNewSnapshot();

    if (didPopulate) msg.channel.send('created new Faab Snapshot!!');
    else msg.channel.send('could not create Faab Snapshot.');
  },
};
