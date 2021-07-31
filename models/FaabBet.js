const mongoose = require('mongoose');
const moment = require('moment');
const _ = require('lodash');

const Schema = mongoose.Schema;

const YahooTeam = require('./YahooTeam');

const MAX_FAAB_BET_VALUE = 50;

const SUBSTRING_ID_IDENTIFIER_LENGTH = 5;

const MOMENT_FORMAT = 'dddd MMMM Do YYYY, h:mm:ss a';

const FaabBetSchema = new Schema(
  {
    proposingManagerName: { type: String, required: true },
    acceptingManagerName: { type: String, default: null },
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
  description,
  client
) {
  proposingManagerName = _.capitalize(proposingManagerName);
  acceptingManagerName = _.capitalize(acceptingManagerName);

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

  const id = _.toString(_.get(newFaabBet, '_id'));
  const idTruncated = id.substring(_.size(id) - SUBSTRING_ID_IDENTIFIER_LENGTH);

  try {
    const acceptingManagerUserId = await YahooTeam.getDiscordUserIdByManagerName(
      acceptingManagerName
    );
    const acceptingUser = client.users.cache.get(acceptingManagerUserId);

    acceptingUser.send(
      `${proposingManagerName} proposed a bet to you!\n**${description}**\nTo accept or reject, type \`!accept ${idTruncated}\` or \`!reject ${idTruncated}\``
    );
  } catch (e) {
    console.log(e);
  }

  return `New bet between ${proposingManagerName} and ${acceptingManagerName} created! BetId: \`${idTruncated}\``;
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

FaabBetSchema.statics.getBetsToOrByDiscordUserId = async (
  discordUserId,
  unformatted = false
) => {
  const managerName = await YahooTeam.getManagerNameByDiscordUserId(
    discordUserId
  );
  const allUnresolvedBets = await FaabBet.find({
    $or: [
      { proposingManagerName: managerName },
      { acceptingManagerName: managerName },
    ],
    resolved_at: null,
  }).sort({
    created_at: 'asc',
  });

  if (unformatted) return allUnresolvedBets;
  else return formatGetBetsToOrByDiscordUserId(allUnresolvedBets);
};

const formatGetBetsToOrByDiscordUserId = (bets) => {
  return _.map(bets, (b) => {
    const acceptingManagerName = _.get(b, 'acceptingManagerName');
    const proposingManagerName = _.get(b, 'proposingManagerName');
    const faabAmount = _.get(b, 'faabAmount');
    const description = _.get(b, 'description');
    const id = _.toString(_.get(b, '_id'));
    const idTruncated = id.substring(
      _.size(id) - SUBSTRING_ID_IDENTIFIER_LENGTH
    );
    const created_at = _.get(b, 'created_at');
    const accepted_at = _.get(b, 'accepted_at');

    const acceptedMsg = accepted_at
      ? `Accepted at ${moment(accepted_at).format(MOMENT_FORMAT)}`
      : 'Pending acceptance';

    return `**${description}** - \`${idTruncated}\`\n${proposingManagerName} asserted this to ${acceptingManagerName} on ${moment(
      created_at
    ).format(MOMENT_FORMAT)}\n${faabAmount} faab is at risk. ${acceptedMsg}\n`;
  });
};

FaabBetSchema.statics.getAllUnacceptedBets = async () => {
  const allUnacceptedBets = await FaabBet.find({
    accepted_at: null,
    rejected_at: null,
    resolved_at: null,
  }).sort({
    created_at: 'asc',
  });

  return formatNewBetsAll(allUnacceptedBets);
};

const formatNewBetsAll = (bets) => {
  return _.map(bets, (b) => {
    const acceptingManagerName = _.get(b, 'acceptingManagerName');
    const proposingManagerName = _.get(b, 'proposingManagerName');
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
    )}\n${faabAmount} faab is at risk. May be accepted/rejected with: \`!accept/!reject ${idTruncated}\`\n`;
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
    )}\n${faabAmount} faab is at risk. May be resolved with: \`!resolve ${idTruncated} (winnerName)\`\n`;
  });
};

FaabBetSchema.statics.getAllActiveBets = async (unformatted = false) => {
  const allActiveBets = await FaabBet.find({
    accepted_at: { $ne: null },
    rejected_at: null,
    resolved_at: null,
  }).sort({
    created_at: 'asc',
  });

  if (unformatted) return allActiveBets;
  else return formatActiveBets(allActiveBets);
};

FaabBetSchema.statics.getAllUnupdatedYahoo = async (
  unformatted = false,
  aggregate = false
) => {
  const allUnupdatedYahooBets = await FaabBet.find({
    accepted_at: { $ne: null },
    rejected_at: null,
    resolved_at: { $ne: null },
    yahoo_week_number: null,
    updated_on_yahoo_at: null,
  }).sort({
    resolved_at: 'asc',
  });

  if (!aggregate) {
    if (unformatted) return allUnupdatedYahooBets;
    else return formatAllUnupdatedYahoo(allUnupdatedYahooBets);
  }

  // const allNamesToUpdate = _.uniq(
  //   _.concat(
  //     _.map(allUnupdatedYahooBets, 'winningManagerName'),
  //     _.map(allUnupdatedYahooBets, 'losingManagerName')
  //   )
  // );

  const grouped = {};

  _.forEach(allUnupdatedYahooBets, (b) => {
    const winningManagerName = _.get(b, 'winningManagerName');
    const winningFaabAmount = _.get(b, 'faabAmount');
    const currWinnersValue = _.get(grouped, winningManagerName, 0);
    _.set(grouped, winningManagerName, currWinnersValue + winningFaabAmount);

    const losingManagerName = _.get(b, 'losingManagerName');
    const losingFaabAmount = winningFaabAmount * -1;
    const currLosersValue = _.get(grouped, losingManagerName, 0);
    _.set(grouped, losingManagerName, currLosersValue + losingFaabAmount);
  });

  return formatGroupedUnupdatedYahoo(grouped);
};

const formatAllUnupdatedYahoo = (bets) => {
  return _.map(bets, (b) => {
    const winningManagerName = _.get(b, 'winningManagerName');
    const losingManagerName = _.get(b, 'losingManagerName');
    const faabAmount = _.get(b, 'faabAmount');
    const description = _.get(b, 'description');
    const id = _.toString(_.get(b, '_id'));
    const idTruncated = id.substring(
      _.size(id) - SUBSTRING_ID_IDENTIFIER_LENGTH
    );
    const accepted_at = _.get(b, 'accepted_at');
    const resolved_at = _.get(b, 'resolved_at');

    return `**${description}**\nid: \`${idTruncated}\`\nAccepted on ${moment(
      accepted_at
    ).format(MOMENT_FORMAT)}\nResolved on ${moment(resolved_at).format(
      MOMENT_FORMAT
    )}\n+${faabAmount} awarded to ${winningManagerName}\n-${faabAmount} lost by ${losingManagerName}\n`;
  });
};

const formatGroupedUnupdatedYahoo = (groupedResults) => {
  let message = 'Summary:\n';

  _.forEach(groupedResults, (faabResult, name) => {
    const optionalPositiveSign = faabResult > 0 ? '+' : '';
    message += `\`${name}\`  \`${optionalPositiveSign}${faabResult}\`\n`;
  });

  return message;
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

FaabBetSchema.methods.acceptBet = async function (client) {
  this.accepted_at = new Date();
  await this.save();

  try {
    const proposingManagerUserId = await YahooTeam.getDiscordUserIdByManagerName(
      this.proposingManagerName
    );
    const proposingUser = client.users.cache.get(proposingManagerUserId);

    const id = _.toString(this._id);
    const idTruncated = id.substring(
      _.size(id) - SUBSTRING_ID_IDENTIFIER_LENGTH
    );

    proposingUser.send(
      `${this.acceptingManagerName} accepted your bet!\n**${this.description}**\nTo resolve type \`!resolve ${idTruncated} (winningManager)\``
    );
  } catch (e) {
    console.log(e);
  }

  return true;
};

FaabBetSchema.methods.rejectBet = async function (discordUserId, client) {
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

  try {
    const managerUserIdToMessage = await YahooTeam.getDiscordUserIdByManagerName(
      managerNameToMessage
    );
    const user = client.users.cache.get(managerUserIdToMessage);

    user.send(
      `${managerNameToMessage} rejected your bet!\n**${this.description}**\n`
    );
  } catch (e) {
    console.log(e);
  }

  return true;
};

FaabBetSchema.methods.resolveBet = async function (winningManagerName, client) {
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

  const id = _.toString(this._id);
  const idTruncated = id.substring(_.size(id) - SUBSTRING_ID_IDENTIFIER_LENGTH);

  try {
    const winningUserId = await YahooTeam.getDiscordUserIdByManagerName(
      winningManagerName
    );
    const winningUser = client.users.cache.get(winningUserId);

    winningUser.send(
      `Congratulations, you won your bet vs ${losingManagerName}!\n**${this.description}**\n${this.faabAmount} faab will be settled next week.`
    );

    const losingUserId = await YahooTeam.getDiscordUserIdByManagerName(
      losingManagerName
    );
    const losingUser = client.users.cache.get(losingUserId);

    losingUser.send(
      `Sorry, you lost your bet vs ${winningManagerName}!\n**${this.description}**\n-${this.faabAmount} faab will be settled next week.`
    );
  } catch (e) {
    console.log(e);
  }

  return `Bet \`${idTruncated}\` resolved!`;
  // return `Bet \`${idTruncated}\` resolved!\nDescription: ${this.description}\n${this.faabAmount} faab will be settled next week.`;
};

FaabBetSchema.methods.updatedOnYahoo = async function (week) {
  this.yahoo_week_number = week;
  this.updated_on_yahoo_at = new Date();

  await this.save();

  return `Bet \`${this._id}\` successfully signified that it was updated on Yahoo!`;
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
