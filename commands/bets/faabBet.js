const _ = require('lodash');

const { YahooTeam, FaabBet } = require('../../models');

module.exports = {
  name: 'bet',
  description:
    "initiate a bet to `(acceptingManagerName)` for `(betAmount)` faab with a `(description)` of the bet. Description should be clear and should detail the initiator's position. e.g. `!bet Ben 5 I will score higher than you this week`",
  enums: ['bet', 'faabBet'],
  disabled: false,
  argsRequired: true,
  argsUsage: '(acceptingManagerName) (betAmount) (description)',
  async execute(msg, args, client) {
    if (_.size(args) < 3)
      return msg.channel.send(
        `Correct usage is \`!bet (acceptingManagerName) (betAmount) (description)\` `
      );

    const proposingManagerName = await YahooTeam.getManagerNameByDiscordUserId(
      msg.author.id
    );

    const acceptingManagerName = args[0];
    const faabAmount = args[1];

    let description = args.slice(2);
    description = _.join(description, ' ');

    let message = await FaabBet.createNewFaabBet(
      proposingManagerName,
      acceptingManagerName,
      faabAmount,
      description
    );

    // TODO: Message receiver

    if (!message) message = 'Something went wrong';

    return msg.channel.send(message);
  },
};
