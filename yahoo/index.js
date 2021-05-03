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

function getInitialAuthFullRoute() {
  const baseUrl = 'https://api.login.yahoo.com/oauth2/request_auth';
  const queryString = qs.stringify({
    client_id: key,
    redirect_uri: 'oob',
    response_type: 'code',
  });

  return `${baseUrl}?${queryString}`;
}

async function postInitialAuthorization() {
  try {
    console.log(authCode);
    const response = await axios({
      url: `https://api.login.yahoo.com/oauth2/get_token`,
      method: 'post',
      headers: {
        Authorization: `Basic ${AUTH_HEADER}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36',
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
    console.error(`Error in getInitialAuthorization(): ${err}`);
  }
}

async function postRefreshAuthorization() {
  try {
    const response = await axios({
      url: `https://api.login.yahoo.com/oauth2/get_token`,
      method: 'post',
      headers: {
        Authorization: `Basic ${AUTH_HEADER}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36',
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
    console.error(`Error in getInitialAuthorization(): ${err}`);
  }
}

module.exports = {
  // getTest,
  getInitialAuthFullRoute,
  postInitialAuthorization,
  postRefreshAuthorization,
};
