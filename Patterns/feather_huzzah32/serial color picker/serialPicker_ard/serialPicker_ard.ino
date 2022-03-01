
// mouse position changes led brightness

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
  cut.begin(Serial);
  pinMode(rPin,OUTPUT);
  pinMode(gPin,OUTPUT);
  pinMode(bPin,OUTPUT);
}

void loop() {
  // expect message of form -->  * data ,#
  // ie. one data point, index 0 and its an int so
  // we get taht dat with   -->  .getInt(0)
  if (cut.listen() > 0) {       // have a new message?
    rBrightness = cut.getInt(0);   // receiving one number from 0-255
    gBrightness = cut.getInt(1);
    bBrightness = cut.getInt(2);
  }
  analogWrite(rPin, rBrightness);
  analogWrite(gPin, gBrightness);
  analogWrite(bPin, bBrightness);

}
