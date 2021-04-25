module.exports = {
  name: 'userInfo',
  description: 'displays information about the current user',
  enums: ['me', 'user-info', 'userInfo', 'userInformation'],
  execute(msg, args) {
    msg.channel.send(
      `Your username: ${msg.author.username}\nYour ID: ${msg.author.id}`
    );
  },
};
