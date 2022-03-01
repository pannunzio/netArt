// connect to wifi with adafruit feather32 (esp32)
// verbose 
// NOTE: you can remove the array of strings and printWiFiStatus in production
// as these are just for debug

// there are lots of other esp32 functions:
// https://randomnerdtutorials.com/esp32-useful-wi-fi-functions-arduino/#4

#include <WiFi.h> // included in esp32 package

// wifi password and ssid in secrets.h
#include "secrets.h"

// this is memory intensive so for this demo only
// wifi status is actually an int so, 
// array position corresponds to numerical value of WiFi.status();
String wifiStatusArray[7] = {"WL_IDLE_STATUS","WL_NO_SSID_AVAIL","WL_SCAN_COMPLETED","WL_CONNECTED","WL_CONNECT_FAILED","WL_CONNECTION_LOST","WL_DISCONNECTED"};

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  printWiFiStatus();
  initWiFi();
}

void loop() {
  // put your main code here, to run repeatedly:
  printWiFiStatus();
  Serial.println("demo complete");
  while(1);
}


void initWiFi() {
  
  WiFi.mode(WIFI_STA);  // station mode -- not needed if you are not changing modes
  WiFi.begin(ssid, password);  // secrets.h tab
  
  Serial.println("Connecting to WiFi ..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    printWiFiStatus();
    delay(500);
  }
  
  Serial.print("\nconnected to ");
  Serial.println(ssid);
  Serial.print("with IP ");
  Serial.println(WiFi.localIP());
}

// utility function -- uses array of states at top of code
void printWiFiStatus(){
  int wifistatus = WiFi.status(); 
  Serial.print("Wifi status = " );
  Serial.println( wifiStatusArray[ wifistatus ] );
}
