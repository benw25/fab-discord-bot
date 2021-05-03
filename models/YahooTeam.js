const mongoose = require('mongoose');
const moment = require('moment');
const _ = require('lodash');

const { getTeamNameAndIds, LEAGUE_ID } = require('../yahoo-api');
const YahooToken = require('./YahooToken');
const Schema = mongoose.Schema;

const YahooTeamSchema = new Schema({
  id: { type: Number, required: true },
  managerId: { type: Number, required: true },
  managerName: { type: String, required: true },
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

const YahooTeam = mongoose.model('YahooTeam', YahooTeamSchema);

module.exports = YahooTeam;
