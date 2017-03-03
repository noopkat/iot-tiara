const IRC = require('irc-framework');

const bot = new IRC.Client();
bot.connect({
    host: 'irc.chat.twitch.tv',
    port: 6667,
    nick: process.env.TWITCH_NICK,
    password: process.env.TWITCH_TOKEN
});

bot.on('registered', () => {
  console.log('registered on twitch irc!');
  const channel = bot.channel(process.env.TWITCH_CHANNEL);
  channel.join();
  bot.matchMessage(/^gday/i, (event) => {
    event.reply('hello, '+ event.nick);
  });
});
