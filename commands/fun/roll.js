const _ = require('lodash');

const VERBAGE = ['rolled', 'tossed', 'threw', 'randomized'];

module.exports = {
  name: 'roll',
  description: 'roll an _(n)_-sided dice where `n >= 2`.  0 is never rolled.',
  enums: ['roll', 'diceRoll', 'rollDice', 'rand', 'random'],
  argsRequired: true,
  argsUsage: '(n)',
  cooldown: 3,
  execute(msg, args) {
    const numSides = args[0];

    if (isNaN(numSides) || numSides <= 1)
      return msg.reply(
        `invalid \`n\` of \`${numSides}\`, please input a valid \`n\`.`
      );

    const rand = _.random(1, numSides);

    const verbIndex = _.random(0, _.size(VERBAGE) - 1);
    const verbed = VERBAGE[verbIndex];

    const botUsername = _.get(msg, ['client', 'user', 'username']);

    let dieRollMessage = `_${botUsername}_ ${verbed} a ${numSides}-sided die......it rolled **${rand}**`;

    /* for testing
      const a1 = _.fill(Array(_.parseInt(numSides)), 0);
      const a2 = _.fill(Array(_.size(VERBAGE)), 0);

      for (let i = 0; i < 10000; i++) {
        const rand = _.random(1, numSides) - 1;
        a1[rand]++;

        const verbIndex = _.random(0, _.size(VERBAGE) - 1);
        a2[verbIndex]++;
      }
      console.log(a1);
      console.log(a2);
    */

    msg.channel.send(dieRollMessage);
  },
};
