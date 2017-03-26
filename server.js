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

  bot.matchMessage(/^tiara #[0-9A-F]{6}/i, (event) => {
    const colourChoice = event.message.split('#')[1];
    console.log(event.nick + 'turned the tiara hex colour: ' + colourChoice);

    const buff = makeColourBuffer(colourChoice);
    sendToDevice(buff);
  });

  bot.matchMessage(/^tiara red$/i, (event) => {
    console.log(event.nick + ' turned the tiara red!');
    const buff = makeColourBuffer('ff0000');
    sendToDevice(buff);
  });
  bot.matchMessage(/^tiara green$/i, (event) => {
    console.log(event.nick + ' turned the tiara green!');
    const buff = makeColourBuffer('00ff00');
    sendToDevice(buff);
  });
  bot.matchMessage(/^tiara blue$/i, (event) => {
    console.log(event.nick + ' turned the tiara blue!');
    const buff = makeColourBuffer('0000ff');
    sendToDevice(buff);
  });
  bot.matchMessage(/^tiara purple$/i, (event) => {
    console.log(event.nick + ' turned the tiara purple!');
    const buff = makeColourBuffer('8D00AD');
    sendToDevice(buff);
  });
  bot.matchMessage(/^tiara on$/i, (event) => {
    console.log(event.nick + ' turned the tiara on!');
    const buff = makeColourBuffer('ffffff');
    sendToDevice(buff);
  });
  bot.matchMessage(/^tiara off$/i, (event) => {
    console.log(event.nick + ' turned the tiara off!');
    const buff = makeColourBuffer('000000');
    sendToDevice(buff);
  });
});

function makeColourBuffer(hex) {
  const buff = new Buffer(3);
  console.log(buff);

  buff[0] = parseInt(hex.substr(0, 2), 16);
  buff[1] = parseInt(hex.substr(2, 2), 16);
  buff[2] = parseInt(hex.substr(4, 2), 16);

  console.log(buff);
  return buff;
}

function sendToDevice(msg) {
  const iotClient = IotClient.fromConnectionString(process.env.IOT_CONN_STRING);

  iotClient.open(function (err) {
    if (err) {
      console.error('Could not connect: ' + err.message);
    } else {
      console.log('Client connected'); 
      // const data = JSON.stringify(msg);
      const message = new IotMessage(msg);
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