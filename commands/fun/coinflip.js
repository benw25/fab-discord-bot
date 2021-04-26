const _ = require('lodash');

const VERBAGE = [
  'flipped',
  'tossed',
  'dispensed',
  'chanced',
  'produced',
  'procured',
];

module.exports = {
  name: 'flip',
  description: 'flip a coin - HEADS/TAILS',
  enums: ['coin', 'coinFlip', 'flip'],
  execute(msg, args) {
    const rand = _.random(0, 1);

    const verbIndex = _.random(0, _.size(VERBAGE) - 1);
    const verbed = VERBAGE[verbIndex];

    const botUsername = _.get(msg, ['client', 'user', 'username']);

    let coinFlipMessage = `_${botUsername}_ ${verbed} a coin...it was **${
      rand ? 'HEADS' : 'TAILS'
    }**!`;

    /* for testing
      const a1 = [0, 0];
      const a2 = _.fill(Array(_.size(VERBAGE)), 0);

      for (let i = 0; i < 10000; i++) {
        const rand = _.random(0, 1);
        a1[rand]++;

        const verbIndex = _.random(0, _.size(VERBAGE) - 1);
        a2[verbIndex]++;
      }
      console.log(a1);
      console.log(a2);
    */

    msg.channel.send(coinFlipMessage);
  },
};
