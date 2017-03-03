const IRC = require('irc-framework');
const IotClient = require('azure-iothub').Client;
const IotMessage = require('azure-iot-common').Message;

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
    sendToDevice();
  });
});

function sendToDevice() {
  const iotClient = IotClient.fromConnectionString(process.env.IOT_CONN_STRING);

  iotClient.open(function (err) {
    if (err) {
      console.error('Could not connect: ' + err.message);
    } else {
      console.log('Client connected'); 
      const data = JSON.stringify(1);
      const message = new IotMessage(data);
      console.log('Sending message: ' + message.getData());
      iotClient.send(process.env.IOT_DEVICE_ID, message, printResultFor('send'));
    }
  });
}

function printResultFor(op) {
  return function printResult(err, res) {
    if (err) {
      console.log(op + ' error: ' + err.toString());
    } else {
      console.log(op + ' status: ' + res.constructor.name);
    }
  };
}