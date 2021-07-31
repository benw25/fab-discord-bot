const { JOKES } = require('./jokes.js');
const {
  BOT_COMMAND_PREFIX,
  DEFAULT_COOLDOWN,
  getParamNames,
  initializeCommandsGrouped,
  initializeAllCommandEnums,
} = require('./commands-helper.js');
const {
  OPEN_BETS_CHANNEL_NAME,
  OPEN_BETS_CHANNEL_ID,
  FAB_BOT_USER_ID,
} = require('./server-constants.js');

module.exports = {
  JOKES,
  BOT_COMMAND_PREFIX,
  DEFAULT_COOLDOWN,
  getParamNames,
  initializeCommandsGrouped,
  initializeAllCommandEnums,
  OPEN_BETS_CHANNEL_NAME,
  OPEN_BETS_CHANNEL_ID,
  FAB_BOT_USER_ID,
};
