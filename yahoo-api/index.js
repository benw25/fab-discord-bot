const axios = require('axios');
const qs = require('qs');
const _ = require('lodash');

const key = process.env.YAHOO_CONSUMER_KEY;
const secret = process.env.YAHOO_CONSUMER_SECRET;
const authCode = process.env.YAHOO_AUTH_CODE;
const refreshToken = process.env.YAHOO_REFRESH_TOKEN;

const AUTH_HEADER = Buffer.from(`${key}:${secret}`, `binary`).toString(
  `base64`
);

const GAME_IDS = { year2021: 406 };
const LEAGUE_IDS = { year2021: 24861 };

/*
async function getTest() {
  return await axios({
    url: `https://api.login.yahoo.com/openid/v1/userinfo`,
    method: 'get',
    headers: {
      Authorization: `Basic ${AUTH_HEADER}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36',
    },
    timeout: 1000,
  }).catch((err) => {
    console.error(`Error in getInitialAuthorization(): ${err}`);
  });
}
*/

// to auth the app client (only needs to be run once). copy/paste URL, then get token
function getInitialAuthFullRoute() {
  const baseUrl = 'https://api.login.yahoo.com/oauth2/request_auth';
  const queryString = qs.stringify({
    client_id: key,
    redirect_uri: 'oob',
    response_type: 'code',
  });

  return `${baseUrl}?${queryString}`;
}

// to get initial bearer auth token, and more importantly, the refresh token that needs to be saved
// will throw 400 on Yahoo's side after the first time
async function postInitialAuthorization() {
  try {
    console.log(authCode);
    const response = await axios({
      url: `https://api.login.yahoo.com/oauth2/get_token`,
      method: 'post',
      headers: {
        Authorization: `Basic ${AUTH_HEADER}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify({
        client_id: key,
        client_secret: secret,
        redirect_uri: 'oob',
        code: authCode,
        grant_type: 'authorization_code',
      }),
      timeout: 10000,
    });

    return _.get(response, 'data');
  } catch (err) {
    console.error(`Error in postInitialAuthorization(): ${err}`);
  }
}

// Yahoo's 2.0 OAuth Refresh
async function postRefreshAuthorization() {
  try {
    const response = await axios({
      url: `https://api.login.yahoo.com/oauth2/get_token`,
      method: 'post',
      headers: {
        Authorization: `Basic ${AUTH_HEADER}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify({
        client_id: key,
        client_secret: secret,
        redirect_uri: 'oob',
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
      timeout: 10000,
    });

    return _.get(response, 'data');
  } catch (err) {
    console.error(`Error in postRefreshAuthorization(): ${err}`);
  }
}

async function getLeagueInfo(token) {
  try {
    const response = await axios({
      url: `https://fantasysports.yahooapis.com/fantasy/v2/league/${GAME_IDS.year2021}.l.${LEAGUE_IDS.year2021}?format=json`,
      // url: `https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys/?format=json`, // to get list of gameIds
      method: 'get',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 10000,
    });

    return _.get(response, 'data');
  } catch (err) {
    // console.log(err);
    const response = _.get(err, 'response');
    console.log(_.get(response, 'status'), _.get(response, 'statusText'));
    console.log(_.get(response, 'data'));
    console.error(`Error in getLeagueInfo(): ${err}`);
  }
}

module.exports = {
  // getTest,
  getInitialAuthFullRoute,
  postInitialAuthorization,
  postRefreshAuthorization,
  getLeagueInfo,
};
