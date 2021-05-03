const Discord = require('discord.js');
const _ = require('lodash');
const fs = require('fs');
require('dotenv').config();

const {
  BOT_COMMAND_PREFIX,
  DEFAULT_COOLDOWN,
  getParamNames,
  initializeCommandsGrouped,
  initializeAllCommandEnums,
} = require('./constants');
const {
  postInitialAuthFullRoute,
  postRefreshAuthorization,
} = require('./yahoo/index.js');

const COMMANDS_DIRECTORY = './commands';

const client = new Discord.Client();

client.commands = new Discord.Collection();
initializeAllCommandEnums(client.commands, COMMANDS_DIRECTORY);

client.commandsGroupedEnums = new Discord.Collection();
initializeCommandsGrouped(client.commandsGroupedEnums, COMMANDS_DIRECTORY);

client.cooldowns = new Discord.Collection();

client.login(process.env.DISCORD_BOT_TOKEN);

const eventFiles = fs
  .readdirSync('./events')
  .filter((file) => file.endsWith('.js'));

for (const eventFile of eventFiles) {
  const event = require(`./events/${eventFile}`);
  if (event.once) {
    client.once(event.name, (...args) =>
      event.execute(...args, client, postRefreshAuthorization)
    );
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}
