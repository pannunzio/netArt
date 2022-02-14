
// send 2 pots to p5js, get rgb back


#include <Scissors.h>
#include <Glue.h>

Scissors scissors;
Glue  elmers;

// led circuits and states
int rLed = 6;
int gLed = 5;
int bLed = 3;

int r_STATE, g_STATE, b_STATE; // start at zero

// potentiometers circuits and states
int xPot = A0;
int yPot = A1;

int xPot_STATE,yPot_STATE;

// timers
unsigned long sendInterval = 100;
unsigned long timeNow, startTime;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  scissors.begin(Serial);
  elmers.begin(Serial);

  pinMode(rLed, OUTPUT);
  pinMode(gLed, OUTPUT);
  pinMode(bLed, OUTPUT);
  pinMode(xPot, INPUT);
  pinMode(yPot, INPUT);
}

void loop() {
  timeNow = millis();

  if (( timeNow-startTime) > sendInterval){
    xPot_STATE = analogRead(xPot);
    yPot_STATE = analogRead(yPot);
    elmers.create();
    elmers.add(xPot_STATE);
    elmers.add(yPot_STATE);
    elmers.send();
    startTime += sendInterval;
  }


  if(scissors.listen()>0){
    // got and RGB update
    r_STATE = scissors.getInt(0);
    g_STATE = scissors.getInt(1);
    b_STATE = scissors.getInt(2);

    analogWrite(rLed, r_STATE);
    analogWrite(gLed, g_STATE);
    analogWrite(bLed, b_STATE);

  }
}
