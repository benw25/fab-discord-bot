const _ = require('lodash');

const { YahooTeam, FaabBet } = require('../../models');

module.exports = {
  name: 'bet',
  description:
    "initiate a bet. Description should detail the initiator's position.",
  enums: ['bet'],
  sortWeight: -100,
  disabled: false,
  argsRequired: true,
  argsUsage: `(acceptingManagerName or 'open') (betAmount) (description)`,
  async execute(msg, args, client) {
    if (_.size(args) < 3)
      return msg.channel.send(
        `Correct usage is \`!bet (acceptingManagerName or 'open') (betAmount) (description)\`, e.g. \`!bet Ben 5 Heads\` `
      );

    const proposingManagerName = await YahooTeam.getManagerNameByDiscordUserId(
      msg.author.id
    );

    const acceptingManagerName = args[0];
    const faabAmount = args[1];

    let description = args.slice(2);
    description = _.join(description, ' ');

    let message = '';

    if (_.toLower(acceptingManagerName) == 'open') {
      message = await FaabBet.createNewFaabOpenBet(
        proposingManagerName,
        faabAmount,
        description,
        client
      );
    } else {
      message = await FaabBet.createNewFaabBet(
        proposingManagerName,
        acceptingManagerName,
        faabAmount,
        description,
        client
      );
    }

    if (!message) message = 'Something went wrong';

    return msg.channel.send(message);
  },
};
