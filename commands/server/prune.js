const _ = require('lodash');

module.exports = {
  name: 'prune',
  description: 'deletes (x) previous messages',
  enums: ['prune'],
  disabled: true,
  execute(msg, args) {
    let amount = _.parseInt(args[0]);

    if (isNaN(amount)) {
      return msg.reply(`${amount} is not a valid number.`);
    }

    amount += 1; // command message counts as 1

    if (amount <= 1 || amount > 100) {
      return msg.reply(
        'you need to input a number between 1 and 99, inclusive.'
      );
    }
    msg.channel.bulkDelete(amount, true).catch((err) => {
      console.error(err);
      msg.channel.send(
        'there was an error trying to prune messages in this channel!'
      );
    });

    msg.channel.send(`pruned ${_.parseInt(args[0])} messages`);
  },
};
