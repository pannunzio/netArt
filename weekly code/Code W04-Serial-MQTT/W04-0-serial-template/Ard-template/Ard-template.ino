// this is a new comment

#include <Scissors.h>
#include <Glue.h>

Scissors cut;
Glue elmers;

// send timer
unsigned long timeNow, startTime;
unsigned long  interval = 1000;

void setup() {
  // this happens once
  Serial.begin(9600);
  cut.begin(Serial);
  elmers.begin(Serial);
}

void loop() {

  timeNow = millis();

  if (cut.listen()>0){
    // got a message
    // Serial.println(cut.getRaw());
    // int first = cut.getInt(0);
    // int second = cut.getInt(1);
  }

  if ((timeNow - startTime)> interval){
    // time to send
    elmers.create();
    elmers.add(500);
    elmers.add(1000);
    elmers.send();

    // reset timer
    startTime+=interval;
  }
}
