const mongoose = require('mongoose');
const moment = require('moment');
const _ = require('lodash');

const { getTeamNameAndIds, LEAGUE_ID } = require('../yahoo-api');
const YahooToken = require('./YahooToken');
const Schema = mongoose.Schema;

const YahooTeamSchema = new Schema({
  id: { type: Number, required: true },
  teamName: { type: String },
  managerId: { type: Number, required: true },
  managerName: { type: String, required: true },
  discordUserId: { type: String },
  guid: { type: String, required: true },
  created_at: { type: Date, required: true },
  leagueId: { type: Number, required: true },
});

YahooTeamSchema.statics.populate = async function () {
  const token = await YahooToken.getOrCreateMostRecentToken();
  const teams = await getTeamNameAndIds(token);

  _.forEach(teams, async (t) => {
    const { teamId, managerId, nickname, guid } = t;

    const newTeam = new YahooTeam({
      id: teamId,
      managerId: managerId,
      managerName: nickname,
      guid,
      created_at: moment(),
      leagueId: LEAGUE_ID,
    });

    await newTeam.save();
  });

  return true;
};

YahooTeamSchema.statics.updateTeamName = async function (teamId, teamName) {
  const team = await YahooTeam.findOneAndUpdate(
    {
      id: teamId,
    },
    { teamName },
    { new: true }
  );

  return team;
};

YahooTeamSchema.statics.getAllTeams = async function (
  unassociatedOnly = false
) {
  let teams;

  if (unassociatedOnly) {
    teams = await YahooTeam.find({ discordUserId: null }).sort({
      id: 'asc',
    });
  } else {
    teams = await YahooTeam.find({}).sort({
      id: 'asc',
    });
  }

  return teams;
};

YahooTeamSchema.statics.getAllManagerNames = async function () {
  const teams = await YahooTeam.find().select('managerName').sort({
    managerName: 'asc',
  });

  return _.map(teams, (t) => _.capitalize(_.get(t, 'managerName')));
};

YahooTeamSchema.statics.registerTeamToDiscordUser = async function (
  teamId,
  discordUserId
) {
  if (!teamId || !discordUserId)
    throw new Error('Invalid arguments for registerTeamToDiscordUser');

  const team = await YahooTeam.findOneAndUpdate(
    {
      id: teamId,
    },
    { discordUserId },
    { new: true }
  );

  return team;
};

YahooTeamSchema.statics.getManagerNameByDiscordUserId = async function (
  discordUserId
) {
  const team = await YahooTeam.findOne({ discordUserId }).select('managerName');

  return _.capitalize(_.get(team, 'managerName'));
};

YahooTeamSchema.statics.getDiscordUserIdByManagerName = async function (
  managerName
) {
  managerName = _.capitalize(managerName);
  const team = await YahooTeam.findOne({ managerName }).select('discordUserId');

  return _.get(team, 'discordUserId');
};

const YahooTeam = mongoose.model('YahooTeam', YahooTeamSchema);

module.exports = YahooTeam;
