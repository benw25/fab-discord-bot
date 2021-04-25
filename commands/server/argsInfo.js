module.exports = {
  name: 'argsInfo',
  description: 'Information about the arguments provided.',
  enums: ['argsInfo'],
  argsRequired: true,
  disabled: true,
  execute(msg, args) {
    if (!args.length) {
      return msg.channel.send(
        `You didn't provide any arguments, ${msg.author}!`
      );
    } else if (args[0] === 'foo') {
      return msg.channel.send('bar');
    }

    msg.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
  },
};
