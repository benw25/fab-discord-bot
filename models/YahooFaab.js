const mongoose = require('mongoose');
const moment = require('moment');
const _ = require('lodash');

const { getFAABBalances } = require('../yahoo-api');
const YahooTeam = require('./YahooTeam');
const YahooFaabSnapshot = require('./YahooFaabSnapshot');
const Schema = mongoose.Schema;

const YahooFaabSchema = new Schema(
  {
    yahooTeam: {
      type: Schema.Types.ObjectId,
      ref: 'YahooTeam',
      required: true,
    },
    balance: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

YahooFaabSchema.statics.sync = async function () {
  const newSnapshot = await YahooFaabSnapshot.createNewSnapshot();
  const snapshot = _.get(newSnapshot, 'snapshot', {});

  for (let snapshotRow of snapshot) {
    const { teamId, teamName, faabBalance } = snapshotRow;

    let team = await YahooTeam.findOne({
      id: teamId,
    });

    if (!team) throw new Error('no team found');

    const teamObjectId = _.get(team, '_id');

    await YahooFaab.findOneAndUpdate(
      {
        yahooTeam: teamObjectId,
      },
      { balance: faabBalance },
      { new: true, upsert: true }
    );

    await YahooTeam.updateTeamName(teamId, teamName);
  }

  return true;
};

YahooFaabSchema.statics.getBalances = async function (format = true) {
  const teams = await YahooTeam.find({ guid: { $ne: null } }).sort({
    managerName: 'asc',
  });

  let balances = await Promise.all(
    _.map(teams, async (t) => {
      const { teamName, managerName } = t;
      let faab = await YahooFaab.findOne({
        yahooTeam: t._id,
      });
      return {
        teamName,
        managerName,
        balance: _.get(faab, 'balance'),
      };
    })
  );

  if (format) {
    let output = '';
    _.forEach(balances, (b) => {
      const { teamName, managerName, balance } = b;
      output += `${_.upperFirst(
        managerName
      )} (*${teamName}*) - **${balance}**\n`;
    });

    return output;
  }

  return balances;
};

const YahooFaab = mongoose.model('YahooFaab', YahooFaabSchema);

module.exports = YahooFaab;
