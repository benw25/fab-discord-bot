const _ = require('lodash');

const { YahooTeam } = require('../../models');

module.exports = {
  name: 'linkInfo',
  description: 'provides help with user/team <-> Discord association',
  enums: ['linkInfo', 'linkHelp'],
  disabled: false,
  async execute(msg, args, client) {
    const unassociatedTeamsOnly = true;
    let teams = await YahooTeam.getAllTeams(unassociatedTeamsOnly);

    teams = _.map(teams, (t) => {
      return _.pick(t, 'id', 'managerName', 'teamName');
    });

    if (typeof teams == 'object')
      msg.channel.send(`\`${JSON.stringify(teams, null, 2)}\``);
    else msg.channel.send(teams);
  },
};
