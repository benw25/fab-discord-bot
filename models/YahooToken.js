const mongoose = require('mongoose');
const moment = require('moment');
const _ = require('lodash');

const { postRefreshAuthorization } = require('../yahoo-api');
const Schema = mongoose.Schema;

const BUFFER_FOR_TOKEN_EXPIRATION = 5;

const YahooTokenSchema = new Schema({
  token: { type: String, required: true },
  created_at: { type: Date, required: true },
  expires_at: { type: Date, required: true },
});

// YahooTokenSchema.virtual('url').get(function () {
//   return '/catalog/yahooToken/' + this._id;
// });

YahooTokenSchema.statics.getOrCreateMostRecentToken = async function () {
  let row = await YahooToken.findOne({
    expires_at: { $gt: moment() },
  }).sort({ field: 'asc', expires_at: -1 });

  if (!row) {
    const auth = await postRefreshAuthorization();

    const token = _.get(auth, 'access_token');
    const expiresIn = _.get(auth, 'expires_in') - BUFFER_FOR_TOKEN_EXPIRATION; // seconds

    const newToken = new YahooToken({
      token,
      created_at: moment(),
      expires_at: moment().add(expiresIn, 'seconds'),
    });

    row = await newToken.save();
  }

  const bearerToken = _.get(row, 'token');

  return bearerToken;
};

YahooTokenSchema.statics.refreshToken = async function () {
  const row = await YahooToken.findOne({
    expires_at: { $gt: moment() },
  }).sort({ field: 'asc', expires_at: -1 });

  return row;
};

const YahooToken = mongoose.model('YahooToken', YahooTokenSchema);

module.exports = YahooToken;
