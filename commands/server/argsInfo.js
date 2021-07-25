module.exports = {
  name: 'argsInfo',
  description: 'Information about the arguments provided.',
  enums: ['argsInfo'],
  argsRequired: true,
  argsUsage: '(value)',
  disabled: true,
  execute(msg, args) {
    const value = args[0];

    if (value === 'foo') {
      return msg.channel.send(value);
    }

    msg.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
  },
};
