require('dotenv').config();

const promisify = require('promisify-node');
const fs = promisify('fs');

const IotClient = require('azure-iothub').Client;
const IotMessage = require('azure-iot-common').Message;

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(express.static('public'));

const colourRegEx = /^#([0-9A-F]{6})/g

app.post('/colour', function (req, res) {
    console.log("Got some colour");
    if (req.body && req.body.colour) {
        var match = colourRegEx.exec(req.body.colour);
        if (match) {
            var colourChoice = match[1];
            if (colourChoice) {
                console.log(`Colour Chosen ${colourChoice}`);
                const buff = makeColourBuffer(colourChoice);
                sendToDevice(buff);
            }
        }
    }
    res.send();
});

app.listen(process.env.PORT_NUM, function () {
    console.log(`Listening on port ${process.env.PORT_NUM}`);
});

//BEGIN COPY FROM server.js

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

//END COPY FROM server.js