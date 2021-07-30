const _ = require('lodash');

module.exports = {
  name: 'serverInfo',
  description: 'displays server name and member count',
  enums: ['serverInfo', 'server', 'servers'],
  disabled: true,
  async execute(msg, args, client) {
    const guild = client.guilds.cache.get('823311054778925126');

    const members = await guild.members.fetch();
    console.log(members.keys());

    msg.channel.send(
      `This server's name is: ${_.get(msg, [
        'guild',
        'name',
      ])}\nTotal members: ${_.get(msg, ['guild', 'memberCount'])}`
    );
  },
};
