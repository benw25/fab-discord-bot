const _ = require('lodash');

const { JOKES } = require('../constants');

module.exports = {
  name: 'joke',
  description: 'tells a joke',
  enums: ['joke', 'jokes', 'jokez'],
  execute(msg, args) {
    const jokesArrayIndex = _.random(0, _.size(JOKES) - 1);
    msg.channel.send(JOKES[jokesArrayIndex]);
  },
};
