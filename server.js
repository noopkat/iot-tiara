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
  bot.matchMessage(/^tiara red$/i, (event) => {
    console.log(event.nick + ' turned the led red!');
    sendToDevice(1);
  });
  bot.matchMessage(/^tiara green$/i, (event) => {
    console.log(event.nick + ' turned the led green!');
    sendToDevice(2);
  });
  bot.matchMessage(/^tiara blue$/i, (event) => {
    console.log(event.nick + ' turned the led blue!');
    sendToDevice(3);
  });
  bot.matchMessage(/^tiara purple$/i, (event) => {
    console.log(event.nick + ' turned the led purple!');
    sendToDevice(4);
  });
  bot.matchMessage(/^tiara on$/i, (event) => {
    console.log(event.nick + ' turned the led on!');
    sendToDevice(5);
  });
  bot.matchMessage(/^tiara off$/i, (event) => {
    console.log(event.nick + ' turned the led off!');
    sendToDevice(6);
  });
});

function sendToDevice(msg) {
  const iotClient = IotClient.fromConnectionString(process.env.IOT_CONN_STRING);

  iotClient.open(function (err) {
    if (err) {
      console.error('Could not connect: ' + err.message);
    } else {
      console.log('Client connected'); 
      const data = JSON.stringify(msg);
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