#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>

const char* ssid = "";
const char* password = "";
const char* mqtt_server = "";
const char* clientid = "";
const char* username = "";
const char* token = "";
const char* feed_endpoint = "";

WiFiClientSecure espClient;
PubSubClient client(espClient);

long lastMsg = 0;

// set pins for RGB LED
int redPin = 16;
int greenPin = 14;
int bluePin = 12;

// function to connect to the wifi
void setup_wifi() {
  delay(10);

  Serial.println();
  Serial.print("Connecting to wifi");

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  // debug wifi via serial
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

// function to connect to MQTT server
void reconnect_mqtt() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect(clientid, username, token)) {
      Serial.println("connected"); 
      // ... and resubscribe
      client.subscribe(feed_endpoint);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}


// callback function for when a message is dequeued from the MQTT server
void callback(char* topic, byte* payload, unsigned int length) {
  // print message to serial for debugging
  Serial.print("Message arrived: ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  if (length == 3) {
    int red = payload[0];
    int green = payload[1];
    int blue = payload[2];

    setColour(red, green, blue);
  }
}

// function to set RGB LED to custom colours
void setColour(int red, int green, int blue) {
  analogWrite(redPin, red);
  analogWrite(greenPin, green);
  analogWrite(bluePin, blue);
}

void setup() {
  // turn off onboard led
  pinMode(BUILTIN_LED, OUTPUT);
  digitalWrite(BUILTIN_LED, HIGH);

  // set up RGB led pins
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);

  // begin serial for debugging purposes
  Serial.begin(115200);

  // connect to wifi
  setup_wifi();

  // set up connection and callback for MQTT server
  client.setServer(mqtt_server, 8883);
  client.setCallback(callback);

  // connect to MQTT
  reconnect_mqtt();
}


void loop() {
  client.loop();
  long now = millis();

  // debug mqtt connection every 10 seconds
  if (now - lastMsg > 10000) {
    lastMsg = now;

    Serial.print("is MQTT client is still connected: ");
    Serial.println(client.connected());
  }
}