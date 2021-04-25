const { JOKES } = require('./jokes');
const {
  BOT_COMMAND_PREFIX,
  getParamNames,
  initializeCommandsGrouped,
  initializeAllCommandEnums,
} = require('./commands-helper.js');

module.exports = {
  JOKES,
  BOT_COMMAND_PREFIX,
  getParamNames,
  initializeCommandsGrouped,
  initializeAllCommandEnums,
};
