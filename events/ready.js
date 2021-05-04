module.exports = {
  name: 'ready',
  once: true,
  async execute(client, args) {
    console.log('\n*******************');
    console.log(' Bot is CONNECTED!');
    console.log('*******************\n');
  },
};
