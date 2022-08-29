const _ = require('lodash');

const { FaabBet } = require('../../models');

module.exports = {
  name: 'listUnupdatedYahoo',
  description:
    'Lists bets that need to be updated in Yahoo. Add in `agg`/`aggregate` to aggregate the data',
  enums: ['listUnupdatedYahoo', 'listYahooToDo', 'listToDoYahoo'],
  disabled: false,
  argsUsage: '(aggregate = false)',
  async execute(msg, args, client) {
    const unformatted = false;
    const aggregate = args[0] && _.startsWith(args[0], 'agg');
    const bets = await FaabBet.getAllUnupdatedYahoo(unformatted, aggregate);

    if (_.isEmpty(bets)) return msg.channel.send('No bets to update in Yahoo.');
    return msg.channel.send(bets, { split: true });
  },
};
