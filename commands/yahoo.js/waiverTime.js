const _ = require('lodash');
const moment = require('moment');

const { WAIVER_CLAIM_PERIOD_END } = require('../../constants');

module.exports = {
  name: 'waiverTime',
  description: 'tells what time waiver claim period ends in Yahoo',
  enums: ['waiverTime', 'waiver'],
  async execute(msg, args) {
    const endOfTuesday = moment().endOf('day').day(2);

    const timeUntilEndOfTuesday = moment().to(endOfTuesday, true);

    return msg.channel.send(
      `Waiver deadline is ${WAIVER_CLAIM_PERIOD_END} (Approx \`~${timeUntilEndOfTuesday}\` left)`
    );
  },
};
