
#include <WiFi.h>
#include <ArduinoMqttClient.h> // https://github.com/arduino-libraries/ArduinoMqttClient

// wifi log on credentials -- secrets tab
#include "secrets.h"

// wifi and mqtt clients
WiFiClient wifiClient;  // part of wifi.h
MqttClient mqttClient(wifiClient);

// wifi passwords and shiftr connection info in secrets tab

// mqtt message topics (labels)
String subscribeTopic  = "s-color";  // your topics (you can have many)

#include <Scissors.h>

Scissors cut;

int rPin = 14;
int gPin = 22;
int bPin = 23;

int rBrightness = 255;
int gBrightness = 0;
int bBrightness = 0;

void setup() {
  Serial.begin(9600);

  initWiFi();

    if ( WiFi.status() == WL_CONNECTED)  { // if wifi connects attempt to connect to shiftr
      initMqtt();
    }

  mqttClient.subscribe(subscribeTopic);

  cut.begin(mqttClient);
  pinMode(rPin,OUTPUT);
  pinMode(gPin,OUTPUT);
  pinMode(bPin,OUTPUT);
}

void loop(){
  mqttClient.poll(); // need to keep Mqtt connection alive
  // expect message of form -->  * data,data,data,#
  // ie. one data point, index 0 and its an int so
  // we get taht dat with   -->  .getInt(0)
  if (cut.listen() > 0) {       // have a new message?
    rBrightness = cut.getInt(0);   // receiving one number from 0-255
    gBrightness = cut.getInt(1);
    bBrightness = cut.getInt(2);
    Serial.println(cut.getRaw());
  }
  analogWrite(rPin, rBrightness);
  analogWrite(gPin, gBrightness);
  analogWrite(bPin, bBrightness);
}


void initWiFi() {
  WiFi.mode(WIFI_STA);  // station mode
  WiFi.begin(ssid, password);

  Serial.print("Connecting to WiFi ..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }

  Serial.print("connected to ");
  Serial.println(ssid);
  Serial.print("with IP ");
  Serial.println(WiFi.localIP());

} // end initWifi


void initMqtt(){
 // https://github.com/arduino-libraries/ArduinoMqttClient/blob/master/examples/WiFiSimpleSender/WiFiSimpleSender.ino

  mqttClient.setId(id); // device name
  mqttClient.setUsernamePassword(user, mqttPW);

  Serial.print("\nconnecting to shiftr...");
  while (!mqttClient.connect(broker,port)) {
    Serial.print(".");
    delay(500);
  }

  Serial.print("\nconnected to shiftr @");
  Serial.println(user); // instacne name

} // end initMqtt
