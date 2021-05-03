module.exports = {
  name: 'ready',
  once: true,
  async execute(client, a) {
    const b = await a();
    console.log(b);
    console.log('\n*******************');
    console.log(' Bot is CONNECTED!');
    console.log('*******************\n');
  },
};
