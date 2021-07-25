module.exports = {
  name: 'argsInfo',
  description: 'Information about the arguments provided.',
  enums: ['argsInfo'],
  argsRequired: true,
  argsUsage: '(value)',
  disabled: false,
  execute(msg, args) {
    const value = args[0];

    msg.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
  },
};
