const fs = require('fs');
const _ = require('lodash');

var STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/gm;
var ARGUMENT_NAMES = /([^\s,]+)/g;

const BOT_COMMAND_PREFIX = '!';
const DEFAULT_COOLDOWN = 1;

function getParamNames(func) {
  var fnStr = func.toString().replace(STRIP_COMMENTS, '');
  var result = fnStr
    .slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')'))
    .match(ARGUMENT_NAMES);
  if (result === null) result = [];
  return result;
}

function initializeCommandsGrouped(collection, directory) {
  const commandFolders = fs.readdirSync(directory);

  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`${directory}/${folder}`)
      .filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(`.${directory}/${folder}/${file}`);

      if (!command.disabled) collection.set(_.toLower(command.name), command);
    }
  }
}

function initializeAllCommandEnums(collection, directory) {
  const commandFolders = fs.readdirSync(directory);

  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`${directory}/${folder}`)
      .filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(`.${directory}/${folder}/${file}`);

      const commandEnums = _.get(command, 'enums');

      if (_.isEmpty(commandEnums) && !!_.get(command, 'name'))
        throw new Error(`commandEnums must not be empty for ${command.name}`);

      if (!command.disabled)
        for (let commandEnum of commandEnums)
          collection.set(_.toLower(commandEnum), command);
    }
  }
}

module.exports = {
  BOT_COMMAND_PREFIX,
  DEFAULT_COOLDOWN,
  getParamNames,
  initializeCommandsGrouped,
  initializeAllCommandEnums,
};
