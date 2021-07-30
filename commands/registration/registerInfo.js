const _ = require('lodash');

const { YahooTeam } = require('../../models');

module.exports = {
  name: 'registerInfo',
  description: 'provides help with user/team <-> Discord association',
  enums: ['registerInfo', 'registerHelp'],
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

    /*
    `Your username: ${msg.author.username}\nYour ID: ${msg.author.id}`;

    const guild = client.guilds.cache.get('823311054778925126');

    const members = await guild.members.fetch();
    console.log(members.keys());

    msg.channel.send(
      `This server's name is: ${_.get(msg, [
        'guild',
        'name',
      ])}\nTotal members: ${_.get(msg, ['guild', 'memberCount'])}`
    );
    */
  },
};
