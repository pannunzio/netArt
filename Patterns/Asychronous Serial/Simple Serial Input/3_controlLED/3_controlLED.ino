long baudRate = 9600;
int ledPin = 6; 

void setup() {
    Serial.begin(baudRate);
    pinMode(ledPin, OUTPUT);
}

void loop() {

         // loop through and .read() the buffer until empty.
          while (Serial.available()) {
              char readByte = Serial.read(); 
              Serial.println(readByte);  
              if ( readByte == 'H' ) digitalWrite(ledPin, HIGH); // 1
              if ( readByte == 'h' ) digitalWrite(ledPin, HIGH); // 1
              if ( readByte == 'L' ) digitalWrite(ledPin, LOW);  // 0
          }
     
    delay(10);
}
