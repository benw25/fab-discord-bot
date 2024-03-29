const _ = require('lodash');

const {
  getInitialAuthFullRoute,
  postInitialAuthorization,
} = require('../../yahoo-api');

module.exports = {
  name: 'yahooInitialize',
  description:
    'initializes yahoo app client (only needs to be run once per client)',
  enums: ['yahooInitialize'],
  disabled: true,
  async execute() {
    console.log(getInitialAuthFullRoute()); // visit this URL in browser, authorize, then paste YAHOO_AUTH_CODE into .env
    console.log("Visit the above URL in Browser, then auth, then code the YAHOO_AUTH_CODE to .env file")
    const initialAuth = await postInitialAuthorization();
    console.log(initialAuth); // save the YAHOO_REFRESH_TOKEN token in .env
  },
};
