const fs = require('fs');
const _ = require('lodash');

var STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/gm;
var ARGUMENT_NAMES = /([^\s,]+)/g;

const BOT_COMMAND_PREFIX = '!';

function getParamNames(func) {
  var fnStr = func.toString().replace(STRIP_COMMENTS, '');
  var result = fnStr
    .slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')'))
    .match(ARGUMENT_NAMES);
  if (result === null) result = [];
  return result;
}

function initializeCommandsGrouped(collection, directory) {
  const commandFiles = fs
    .readdirSync(directory)
    .filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`.${directory}/${file}`);
    collection.set(_.toLower(command.name), command);
  }
}

function initializeAllCommandEnums(collection, directory) {
  const commandFiles = fs
    .readdirSync(directory)
    .filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`.${directory}/${file}`);

    const commandEnums = _.get(command, 'enums');

    for (let commandEnum of commandEnums)
      collection.set(_.toLower(commandEnum), command);
  }
}

module.exports = {
  BOT_COMMAND_PREFIX,
  getParamNames,
  initializeCommandsGrouped,
  initializeAllCommandEnums,
};
