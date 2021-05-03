const _ = require('lodash');

const {
  postInitialAuthFullRoute,
  postRefreshAuthorization,
  getLeagueInfo,
} = require('../../yahoo-api');

module.exports = {
  name: 'test',
  description: 'tests yahoo commands',
  enums: ['test'],
  async execute(msg, args) {
    const refreshAuth = await postRefreshAuthorization();
    const token = _.get(refreshAuth, 'access_token');
    msg.channel.send(token);

    const a = await getLeagueInfo(token);
    console.log(a);
  },
};
