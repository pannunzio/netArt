long baudRate = 9600;

void setup() {
    Serial.begin(baudRate);
}

void loop() {

         // loop through and .read() the buffer until empty.
          while (Serial.available()) {
              char readByte = Serial.read(); 
              Serial.println(readByte);  
          }
     
    delay(10);
}
