const _ = require('lodash');
const moment = require('moment');
require('dotenv').config();

const { YahooToken } = require('../../models');

module.exports = {
  name: 'getBearerToken',
  description: 'tests db commands (get bearer token)',
  enums: ['getBearerToken'],
  disabled: true,
  async execute(msg) {
    const bearerToken = await YahooToken.getOrCreateMostRecentToken();

    if (!bearerToken) return;

    const partialToken = bearerToken.substring(0, 5) + '...';

    msg.channel.send(partialToken);
  },
};
