module.exports = {
  name: 'argsInfo',
  description: 'Information about the arguments provided.',
  enums: ['argsInfo'],
  argsRequired: true,
  argsUsage: '(value)',
  disabled: false,
  execute(msg, args) {
    if (!args.length) {
      return msg.channel.send(
        `You didn't provide any arguments, ${msg.author}!`
      );
    }

    const value = args[0];

    if (value === 'foo') {
      return msg.channel.send('bar');
    }

    msg.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
  },
};
