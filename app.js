const Discord = require('discord.js');
const _ = require('lodash');
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

const {
  BOT_COMMAND_PREFIX,
  DEFAULT_COOLDOWN,
  getParamNames,
  initializeCommandsGrouped,
  initializeAllCommandEnums,
} = require('./constants');

const COMMANDS_DIRECTORY = './commands';
const MONGO_URI = process.env.MONGO_URI;

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
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

console.log('Mongo connected...');
