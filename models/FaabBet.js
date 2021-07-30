const mongoose = require('mongoose');
const moment = require('moment');
const _ = require('lodash');

const Schema = mongoose.Schema;

const YahooTeam = require('./YahooTeam');

const MAX_FAAB_BET_VALUE = 5;

const SUBSTRING_ID_IDENTIFIER_LENGTH = 5;

const MOMENT_FORMAT = 'dddd MMMM Do YYYY, h:mm:ss a';

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

  if (_.capitalize(proposingManagerName) == _.capitalize(acceptingManagerName))
    return `You can't bet with yourself. Please enter a different \`acceptingManagerName\``;

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
  discordUserId,
  unformatted = false
) => {
  const managerName = await YahooTeam.getManagerNameByDiscordUserId(
    discordUserId
  );
  const allBetsOfferedToManager = await FaabBet.find({
    acceptingManagerName: managerName,
    accepted_at: null,
    rejected_at: null,
    resolved_at: null,
  }).sort({
    created_at: 'asc',
  });

  if (unformatted) return allBetsOfferedToManager;
  else return formatNewBets(allBetsOfferedToManager);
};

const formatNewBets = (bets) => {
  return _.map(bets, (b) => {
    const proposingManagerName = _.get(b, 'proposingManagerName');
    const faabAmount = _.get(b, 'faabAmount');
    const description = _.get(b, 'description');
    const id = _.toString(_.get(b, '_id'));
    const idTruncated = id.substring(
      _.size(id) - SUBSTRING_ID_IDENTIFIER_LENGTH
    );
    const created_at = _.get(b, 'created_at');

    return `**${description}**\nAsserted by ${proposingManagerName} on ${moment(
      created_at
    ).format(
      MOMENT_FORMAT
    )}\nAt the risk of ${faabAmount} faab, you can accept or reject the other side with: \`!accept/reject ${idTruncated}\`\n`;
  });
};

FaabBetSchema.statics.getAllUnacceptedBetsOfferedByDiscordUserId = async (
  discordUserId,
  unformatted = false
) => {
  const managerName = await YahooTeam.getManagerNameByDiscordUserId(
    discordUserId
  );
  const allBetsOfferedByManager = await FaabBet.find({
    proposingManagerName: managerName,
    accepted_at: null,
    rejected_at: null,
    resolved_at: null,
  }).sort({
    created_at: 'asc',
  });

  if (unformatted) return allBetsOfferedByManager;
  else return formatNewBetsToRescind(allBetsOfferedByManager);
};

const formatNewBetsToRescind = (bets) => {
  return _.map(bets, (b) => {
    const acceptingManagerName = _.get(b, 'acceptingManagerName');
    const faabAmount = _.get(b, 'faabAmount');
    const description = _.get(b, 'description');
    const id = _.toString(_.get(b, '_id'));
    const idTruncated = id.substring(
      _.size(id) - SUBSTRING_ID_IDENTIFIER_LENGTH
    );
    const created_at = _.get(b, 'created_at');

    return `**${description}**\nYou asserted this to ${acceptingManagerName} on ${moment(
      created_at
    ).format(
      MOMENT_FORMAT
    )}\n${faabAmount} faab is at risk. You may rescind with: \`!reject ${idTruncated}\`\n`;
  });
};

FaabBetSchema.statics.getAllActiveBetsToOrByDiscordUserId = async (
  discordUserId,
  unformatted = false
) => {
  const managerName = await YahooTeam.getManagerNameByDiscordUserId(
    discordUserId
  );
  const allActiveBetsToManager = await FaabBet.find({
    proposingManagerName: managerName,
    accepted_at: { $ne: null },
    rejected_at: null,
    resolved_at: null,
  }).sort({
    created_at: 'asc',
  });

  const allActiveBetsByManager = await FaabBet.find({
    acceptingManagerName: managerName,
    accepted_at: { $ne: null },
    rejected_at: null,
    resolved_at: null,
  }).sort({
    created_at: 'asc',
  });

  const allActiveBetsToOrBy = _.uniqBy(
    _.concat(allActiveBetsToManager, allActiveBetsByManager),
    (b) => _.toString(b._id)
  );

  if (unformatted) return allActiveBetsToOrBy;
  else return formatActiveBets(allActiveBetsToOrBy);
};

const formatActiveBets = (bets) => {
  return _.map(bets, (b) => {
    const proposingManagerName = _.get(b, 'proposingManagerName');
    const acceptingManagerName = _.get(b, 'acceptingManagerName');
    const faabAmount = _.get(b, 'faabAmount');
    const description = _.get(b, 'description');
    const id = _.toString(_.get(b, '_id'));
    const idTruncated = id.substring(
      _.size(id) - SUBSTRING_ID_IDENTIFIER_LENGTH
    );
    const created_at = _.get(b, 'created_at');

    return `**${description}**\n${proposingManagerName} asserted this to ${acceptingManagerName} on ${moment(
      created_at
    ).format(
      MOMENT_FORMAT
    )}\n${faabAmount} faab is at risk. You may resolve this with: \`!resolve ${idTruncated}\`\n`;
  });
};

FaabBetSchema.statics.filterBetById = (bets, betId) => {
  const foundBet = _.find(bets, (b) => {
    const objectId = _.toString(_.get(b, '_id'));
    const idTruncated = objectId.substring(
      _.size(objectId) - SUBSTRING_ID_IDENTIFIER_LENGTH
    );

    return betId == idTruncated;
  });

  if (!foundBet) return null;

  return foundBet;
};

FaabBetSchema.methods.acceptBet = async function () {
  this.accepted_at = new Date();
  await this.save();

  // TODO: message receiver
  return true;
};

FaabBetSchema.methods.rejectBet = async function (discordUserId) {
  const managerName = await YahooTeam.getManagerNameByDiscordUserId(
    discordUserId
  );

  this.rejected_at = new Date();
  await this.save();

  let managerNameToMessage = '';
  if (managerName == this.proposingManagerName)
    managerNameToMessage = this.acceptingManagerName;
  else if (managerName == this.acceptingManagerName)
    managerNameToMessage = this.proposingManagerName;
  console.log(managerNameToMessage);

  // TODO: Message managerNameToMessage

  return true;
};

FaabBetSchema.methods.resolveBet = async function (winningManagerName) {
  winningManagerName = _.capitalize(winningManagerName);

  let losingManagerName;

  if (this.proposingManagerName == winningManagerName)
    losingManagerName = this.acceptingManagerName;
  else if (this.acceptingManagerName == winningManagerName)
    losingManagerName = this.proposingManagerName;
  else
    return `${winningManagerName} is not a manager that was a part of the bet.`;

  this.winningManagerName = winningManagerName;
  this.losingManagerName = losingManagerName;
  this.resolved_at = new Date();

  await this.save();

  // message some1

  return `Bet \`${this._id}\` successfully resolved!`;
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
