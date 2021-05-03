const _ = require('lodash');
const moment = require('moment');
require('dotenv').config();

const { YahooTeam } = require('../../models');

module.exports = {
  name: 'populateTeams',
  description: 'populates team from yahoo to mongo',
  enums: ['populateTeams'],
  disabled: true,
  async execute(msg) {
    const didPopulate = await YahooTeam.populate();

    if (didPopulate) msg.channel.send('populated YahooTeams table!');
    else msg.channel.send('could not populate YahooTeams table');
  },
};
