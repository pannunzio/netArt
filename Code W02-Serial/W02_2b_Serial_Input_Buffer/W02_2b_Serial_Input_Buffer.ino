int baudRate = 9600;

void setup() {
    Serial.begin(baudRate);
}

void loop() {
  
     // print number of characters in the buffer
     Serial.print("Serial available = ");
     Serial.println(Serial.available());

     // if buffer gets 5 or more characters print out the buffer
     if ( Serial.available()>=5){

         // loop through and .read() the buffer until empty.
          while (Serial.available()) {
              char b = Serial.read();  
              Serial.print(b);
              //Serial.println();
          }
          // wait a long time
          delay(10000);
          Serial.println(); // new line
     }

    delay(10);
}
