require('dotenv').config();
const IRC = require('irc-framework');
const IotClient = require('azure-iothub').Client;
const IotMessage = require('azure-iot-common').Message;

const bot = new IRC.Client();

const colours = {
  red: 'FF0000',
  green: '00FF00',
  blue: '0000FF',
  purple: '8D00AD',
  orange: 'FF2000',
  pink: 'FF20B0',
  on: 'FFFFFF',
  off: '000000'
};

const colourRegEx = new RegExp('^tiara (#[0 - 9A- F]{6}|' + Object.keys(colours).join('|') + ')$', "i").compile();

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

  bot.matchMessage(colourRegEx, (event) => {
      var colourChoice = colourRegEx.exec(event.message)[1];
      if (colourChoice.charAt(0) === '#') {
          colourChoice = colourChoice.substr(1);
      }
      else {
          colourChoice = colours[colourChoice];
      }
      console.log(event.nick + ' turned the tiara hex colour: ' + colourChoice);
      const buff = makeColourBuffer(colourChoice);
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