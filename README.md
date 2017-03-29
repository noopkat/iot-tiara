# IoT Tiara

Get your nerdy twee on!

## What on Earth is this

I'm glad you asked! This repo holds all the files you need to create your very own IoT Tiara.

This tiara can light up in a variety of colours, controlled by the internet. You can control it any way you like, however the code setup in this repo will get you started with allowing your Twitch chat channel participants to do this by chat commands.

Here is a dorky photo of yours truly wearing it:

![dork](http://i.imgur.com/9HGyNHp.jpg)


## How do I make one of my own?

You'll need:

+ [Adafruit Huzzah Breakout Board](https://www.adafruit.com/product/2471)
+ [FTDI Serial USB cable](https://www.adafruit.com/products/70)
+ Hookup wire
+ 3 RGB LEDs (common anode type)
+ 3 220 ohm resistors
+ [350mAh 3.7v LiPo battery](https://www.adafruit.com/products/2750)
+ [LiPo battery charger](https://www.adafruit.com/products/1304)
+ Super glue / nail glue
+ Hot glue gun
+ Electrical tape (~15mm wide)
+ Faux flowers (try Etsy)
+ Soldering iron + solder
+ Sidecutters
+ Wire stripper tool
+ Access to a 3D printer (or online, such as [Shapeways](http://shapeways.com))

1. Download and print each STL file on a 3D printer. Using [t-glase](http://taulman3d.com/t-glase-features.html) for the LED crystal shards looks really cool.
2. On the headband, use a hot soldering iron tip to melt 4 tiny holes for each RGB LED so the leads can be fed through the headband. Line up the printed crystal shards to mark the placement of these holes. [Reference photo](http://i.imgur.com/BpxyAZQ.jpg)
3. Feed the RGB LEDs through the headband, all in the same orientation. [Reference photo](http://i.imgur.com/oQRnDvE.jpg)
4. Connect the red LED leads together with wire and solder, on the underside of the headband. Do the same with the green, blue, and ground leads. [Reference photo](http://i.imgur.com/lxbLE2s.jpg)
5. Solder 2 connected headers to the VBatt and GND pinouts on the Huzzah. This is for the battery to plug into. Make sure the long ends of the header pins face upwards from the front of the board.
6. Solder 6 connected headers to the FTDI pinouts on the Huzzah. Make sure the long ends of the header pins face upwards from the front of the board.
7. Solder a resistor to each of the following pins: #12, #14, #16
8. Attach the case bottom to the bottom right side of the headband with electrical tape, via the slots in the bottom of the case. Place the Huzzah board into the 3D printed case bottom.
9. From the far right RGB LED, connect its leads to the board by tracing wire along the underside of the headband. Ground connects to the free GND pin, red to #16 resistor, green to #14 resistor, and blue to #12 resistor.
10. Time to test! Connect the FTDI friend to the Huzzah, the other end to your computer.
11. Edit src/tiara-MQTT.ino to include your own wifi and Azure IoT Hub credentials. See the next section below on how quick it is to get your IoT Hub and new device all set up first.
12. Compile and upload to the board. You're ready to test! See the software section below to get the rest up and running.
13. If the software and hardware is all working as expected, go ahead and glue the crystal shards to the headband with super glue / nail glue.
14. For extra twee-factor, hot glue some flowers to the band carefully. Hot glue can warp the printed headband, so go easy and use glue sparingly.
15. Attach the cover onto the Huzzah case bottom, and you're done!

## How do I set up the software for this?

1. Create an Azure account. It's free to join!
2. Create a new Azure IoT Hub instance following steps 1-6 of [these instructions](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-node-node-getstarted). The free tier allows up to 8000 messages a day.
3. Create a new device within the Device Explorer after clicking on your IoT Hub instance from your Azure Dashboard. Remember the name you gave it, and generate a new SAS token for it to include in the Huzzah sketch (src/tiara-mqtt.ino)
4. You can run the server to listen to Twitch chat either locally, or you can host it in the cloud. You'll need NodeJS installed if you're going local. Whether local or cloud, you'll need to set the following environment variables:
  + `TWITCH_TOKEN` - go to Twitch, log in and [create a token to use](http://twitchapps.com/tmi/).
  + `TWITCH_NICK` - your Twitch username/nick
  + `TWITCH_CHANNEL` - which Twitch chat channel you want to listen to. Example: `#noopkat`
  + `IOT_CONN_STRING` - the connection string of your Azure IoT Hub instance. Find one under 'Shared Access Policies' after clicking on your Hub instance from the Dashboard.
  + `IOT_DEVICE_ID` - the name of the device you set up in the IoT Hub instance.
5. Deploy this repo to the cloud, or run it locally with `npm start`
6. Go to Twitch online, and type commands into the Twitch channel your server is listening on! Try `tiara red` (and other simple colour names) or even 6 digit hex colours! Like `tiara #00ff00` for instance. `tiara off` and `tiara on` also work.
7. Once you verify your tiara works, disconnect the FTDI cable and try plugging in your charged LiPo battery to go cable free!