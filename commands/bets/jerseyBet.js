const _ = require('lodash');

module.exports = {
  name: 'jerseyBet',
  description:
    "use !bet with 'Jersey' in the description instead. There's no special function for jerseyBet",
  enums: ['jerseyBet', 'jersey'],
  async execute(msg, args, client) {
    const message = `use !bet with 'Jersey' in the description instead. There's no special function for jerseyBet`;

    return msg.channel.send(message);
  },
};
