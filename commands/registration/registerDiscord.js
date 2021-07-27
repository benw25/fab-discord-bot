const _ = require('lodash');

const { YahooTeam } = require('../../models');

module.exports = {
  name: 'registerDiscord',
  description:
    'Register a Discord user to a Yahoo `teamId` (use !registerInfo to find your teamId)',
  enums: ['registerDiscord', 'register', 'registerDiscordUser'],
  disabled: false,
  argsUsage: '(teamId)',
  async execute(msg, args, client) {
    const unregisteredTeams = await YahooTeam.getAllTeams();

    if (!_.size(unregisteredTeams))
      return msg.channel.send(`All teams are currently registered!`);

    if (_.isEmpty(args))
      return msg.channel.send(
        `Correct usage is \`!register (teamId)\`. Use \`!registerInfo\` to find your teamId.`,
        { split: true }
      );

    const teamId = args[0];

    if (isNaN(teamId))
      return msg.channel.send(
        `invalid \`teamId\` of \`${teamId}\`, please input a valid \`teamId\`.`
      );

    let team = await YahooTeam.findOne({ id: teamId, discordUserId: null });

    if (!team)
      return msg.channel.send(
        `Could not find an unregistered team with id of \`${teamId}\`. please input a valid \`teamId\`.`
      );

    const discordUserId = msg.author.id;

    team = await YahooTeam.findOneAndUpdate(
      {
        id: teamId,
      },
      { discordUserId },
      { new: true }
    );

    await msg.channel.send(
      `Successfully registered your userId of ${discordUserId} with teamId ${teamId}`,
      { split: true }
    );

    return team;
  },
};
