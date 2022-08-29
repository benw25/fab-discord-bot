const _ = require('lodash');

const {
  getLeagueInfo,
  getFAABBalances,
  getTeamNameAndIds,
} = require('../../yahoo-api');

const { YahooToken, YahooFaab, YahooTeam, FaabBet } = require('../../models');

module.exports = {
  name: 'test',
  description: 'tests yahoo commands',
  enums: ['test'],
  disabled: true,
  async execute(msg, args, client) {
    /*
    const token = await YahooToken.getOrCreateMostRecentToken();
    const leagueInfo = await getLeagueInfo(token);
    console.log(JSON.stringify(leagueInfo, null, 2));
    msg.channel.send(`\`${JSON.stringify(leagueInfo, null, 2)}\``);
    const balances = await getFAABBalances(token);
    console.log(balances);
    const bets = await FaabBet.getAllUnacceptedBetsOfferedToDiscordUserId(
      msg.author.id
    );
    console.log(bets);
    */
    /*
    const OPEN_BETS_CHANNEL_ID = '870919767308009532';

    const a = await client.channels.cache
      .get(OPEN_BETS_CHANNEL_ID)
      .messages.fetch({ limit: 100 });

    console.log(a);
    const b = a.find((msg) => _.endsWith(msg.content, 'a3dcf`'));

    b.edit(`~~${b.content}~~`);
    */
    /*
    const newBet = await FaabBet.createNewFaabOpenBet(
      'Ben',
      '2',
      'testBet',
      client
    );
    console.log(newBet);
    */
  },
};
