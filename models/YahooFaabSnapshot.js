const mongoose = require('mongoose');
const moment = require('moment');
const _ = require('lodash');

const { getFAABBalances } = require('../yahoo-api');
const YahooToken = require('./YahooToken');
const Schema = mongoose.Schema;

const YahooFaabSnapshotSchema = new Schema(
  {
    snapshot: { type: Array, required: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

YahooFaabSnapshotSchema.statics.createNewSnapshot = async function () {
  const token = await YahooToken.getOrCreateMostRecentToken();
  const balances = await getFAABBalances(token);

  const newFaabSnapshot = new YahooFaabSnapshot({
    snapshot: balances,
  });

  const newSnapshot = await newFaabSnapshot.save();

  return newSnapshot;
};

YahooFaabSnapshotSchema.statics.getMostRecentSnapshot = async function () {
  const snapshot = await YahooFaabSnapshot.findOne().sort({
    created_at: 'desc',
  });

  return snapshot;
};

const YahooFaabSnapshot = mongoose.model(
  'YahooFaabSnapshot',
  YahooFaabSnapshotSchema
);

module.exports = YahooFaabSnapshot;
