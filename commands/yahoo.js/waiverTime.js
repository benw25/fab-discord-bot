const _ = require('lodash');

const { WAIVER_CLAIM_PERIOD_END } = require('../../constants');

module.exports = {
  name: 'waiverTime',
  description: 'tells what time waiver claim period ends in Yahoo',
  enums: ['waiverTime', 'waiver'],
  async execute(msg, args) {
    return msg.channel.send(
      `Waiver claim period ends at *${WAIVER_CLAIM_PERIOD_END}*`
    );
  },
};
