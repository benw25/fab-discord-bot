const mongoose = require('mongoose');
const moment = require('moment');
const _ = require('lodash');

const Schema = mongoose.Schema;

const YahooTeam = require('./YahooTeam');

const MAX_FAAB_BET_VALUE = 5;

const FaabBetSchema = new Schema(
  {
    proposingManagerName: { type: String, required: true },
    acceptingManagerName: { type: String, required: true },
    faabAmount: { type: Number, required: true },
    description: { type: String, required: true },
    accepted_at: { type: Date, default: null },
    rejected_at: { type: Date, default: null },
    winningManagerName: { type: String },
    losingManagerName: { type: String },
    resolved_at: { type: Date, default: null },
    yahoo_week_number: { type: Number },
    updated_on_yahoo_at: { type: Date },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

FaabBetSchema.statics.createNewFaabBet = async function (
  proposingManagerName,
  acceptingManagerName,
  faabAmount,
  description
) {
  if (
    !proposingManagerName ||
    !acceptingManagerName ||
    !faabAmount ||
    !description
  )
    return 'Invalid arguments for createNewFaabBet';

  faabAmount = _.toNumber(faabAmount);

  try {
    await validateManagerName(proposingManagerName);
    await validateManagerName(acceptingManagerName);
    validateFaabAmount(faabAmount);
  } catch (e) {
    return e.message;
  }

  const newFaabBet = new FaabBet({
    proposingManagerName,
    acceptingManagerName,
    faabAmount,
    description,
  });

  await newFaabBet.save();

  return `Success! New bet between ${proposingManagerName} and ${acceptingManagerName} created!`;
};

FaabBetSchema.statics.getAllUnacceptedBetsOfferedToDiscordUserId = async (
  discordUserId
) => {
  const managerName = await YahooTeam.getManagerNameByDiscordUserId(
    discordUserId
  );
  const allBetsOfferedToManager = await FaabBet.find({
    acceptingManagerName: managerName,
    accepted_at: null,
    rejected_at: null,
    resolved_at: null,
  });

  return allBetsOfferedToManager;
};

const validateManagerName = async (managerName) => {
  managerName = _.capitalize(managerName);

  const allManagerNames = await YahooTeam.getAllManagerNames();

  if (!_.includes(allManagerNames, managerName)) {
    throw new Error(`'${managerName}' is not a valid manager.`);
  }

  return true;
};

const validateFaabAmount = (faabAmount) => {
  if (!_.isInteger(faabAmount))
    throw new Error(`${faabAmount} is not a valid integer.`);

  if (faabAmount < 0)
    throw new Error(`BetSize too small: ${faabAmount} is less than 0`);
  if (faabAmount > MAX_FAAB_BET_VALUE)
    throw new Error(
      `BetSize too large: ${faabAmount} is greater than the max of ${MAX_FAAB_BET_VALUE}`
    );
};

const FaabBet = mongoose.model('FaabBet', FaabBetSchema);

module.exports = FaabBet;
