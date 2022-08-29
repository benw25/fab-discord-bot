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

const currYear = 'year2022';
const GAME_IDS = { year2021: 406, year2022: 414 };
const LEAGUE_IDS = { year2021: 24861, year2022: 347907 };
const LEAGUE_ID = _.get(LEAGUE_IDS, currYear);

const TEAM_ID_KEY_NAME = 'team_id';
const TEAM_NAME_KEY_NAME = 'name';
const FAAB_BALANCE_KEY_NAME = 'faab_balance';
const WAIVER_PRIORITY_KEY_NAME = 'waiver_priority';
const NUMBER_OF_MOVES_KEY_NAME = 'number_of_moves';
const NUMBER_OF_TRADES_KEY_NAME = 'number_of_trades';

const PROPERTIES_TO_KEEP_IN_DETAILS = [
  TEAM_ID_KEY_NAME,
  TEAM_NAME_KEY_NAME,
  FAAB_BALANCE_KEY_NAME,
  WAIVER_PRIORITY_KEY_NAME,
  NUMBER_OF_MOVES_KEY_NAME,
  NUMBER_OF_TRADES_KEY_NAME,
];

// MAYBE TODO: Refactor to use common axios request

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
      url: `https://fantasysports.yahooapis.com/fantasy/v2/league/${GAME_IDS[currYear]}.l.${LEAGUE_IDS[currYear]}?format=json`,
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

async function getFAABBalances(token) {
  try {
    const response = await axios({
      url: `https://fantasysports.yahooapis.com/fantasy/v2/league/${GAME_IDS[currYear]}.l.${LEAGUE_IDS[currYear]}/standings?format=json`,
      // url: `https://fantasysports.yahooapis.com/fantasy/v2/league/${GAME_IDS[currYear]}.l.${LEAGUE_IDS[currYear]}?format=json`,
      // url: `https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys/?format=json`, // to get list of gameIds
      method: 'get',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 10000,
    });

    const teamsPath = [
      'data',
      'fantasy_content',
      'league',
      '1',
      'standings',
      '0',
      'teams',
    ];
    const teams = _.get(response, teamsPath);
    const teamDetailsPath = ['team', '0'];

    const allTeamDetails = [];

    _.forEach(teams, (t) => {
      if (!_.has(t, 'team')) return;
      const teamDetails = _.get(t, teamDetailsPath);

      const customTeamDetailsObject = {};

      _.forEach(PROPERTIES_TO_KEEP_IN_DETAILS, (p) => {
        const property = _.find(teamDetails, (o) => _.includes(_.keys(o), p));
        if (property) _.set(customTeamDetailsObject, p, _.get(property, p));
      });
      allTeamDetails.push(customTeamDetailsObject);
    });

    const balances = _.map(allTeamDetails, (d) => {
      return {
        teamId: _.get(d, TEAM_ID_KEY_NAME),
        teamName: _.get(d, TEAM_NAME_KEY_NAME),
        faabBalance: _.get(d, FAAB_BALANCE_KEY_NAME),
      };
    });

    return balances;
  } catch (err) {
    // console.log(err);
    const response = _.get(err, 'response');
    console.log(_.get(response, 'status'), _.get(response, 'statusText'));
    console.log(_.get(response, 'data'));
    console.error(`Error in getLeagueInfo(): ${err}`);
  }
}

async function getTeamNameAndIds(token) {
  try {
    const response = await axios({
      url: `https://fantasysports.yahooapis.com/fantasy/v2/league/${GAME_IDS[currYear]}.l.${LEAGUE_IDS[currYear]}/teams?format=json`,
      // url: `https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys/?format=json`, // to get list of gameIds
      method: 'get',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 10000,
    });

    const teamsPath = ['data', 'fantasy_content', 'league', '1', 'teams'];
    const teams = _.get(response, teamsPath);

    const allTeamInfo = [];

    _.forEach(teams, (t) => {
      const team = _.get(t, ['team', '0']);

      if (!team) return;

      const team_id = _.find(team, (o) => _.includes(_.keys(o), 'team_id'));
      const managers = _.find(team, (o) => _.includes(_.keys(o), 'managers'));
      const manager = _.get(managers, ['managers', '0', 'manager'], {});
      const { manager_id, nickname, guid } = manager;

      const customTeamDetailsObject = {
        teamId: _.get(team_id, 'team_id'),
        managerId: manager_id,
        nickname,
        guid,
      };

      allTeamInfo.push(customTeamDetailsObject);
    });

    return allTeamInfo;
  } catch (err) {
    // console.log(err);
    const response = _.get(err, 'response');
    console.log(_.get(response, 'status'), _.get(response, 'statusText'));
    console.log(_.get(response, 'data'));
    console.error(`Error in getLeagueInfo(): ${err}`);

    return null;
  }
}

module.exports = {
  // getTest,
  LEAGUE_ID,
  getFAABBalances,
  getInitialAuthFullRoute,
  postInitialAuthorization,
  postRefreshAuthorization,
  getLeagueInfo,
  getTeamNameAndIds,
};
