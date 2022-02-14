int baudRate = 9600;

void setup() {
    Serial.begin(baudRate);
}

void loop() {

         // loop through and .read() the buffer until empty.
          while (Serial.available()) {
              char b = Serial.read(); 
              Serial.println(b);
          }
     
    delay(10);
}
