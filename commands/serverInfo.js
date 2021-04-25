const _ = require('lodash');

module.exports = {
  name: 'serverInfo',
  description: 'displays server name and member count',
  enums: ['server', 'servers', 'serverInfo'],
  execute(msg, args) {
    msg.channel.send(
      `This server's name is: ${_.get(msg, [
        'guild',
        'name',
      ])}\nTotal members: ${_.get(msg, ['guild', 'memberCount'])}`
    );
  },
};
