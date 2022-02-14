int baudRate = 9600;

void setup() {
    Serial.begin(baudRate);
}

void loop() {
   
     Serial.print("Serial available  ");
     Serial.println(Serial.available());
     
     if ( Serial.available()>=1){
          // how to receive
          while (Serial.available()) {
              int b = Serial.read();
              Serial.print("received ");   
              Serial.print(b);   // prints raw receive
              Serial.print("\t = "); // space
              Serial.write(b);   // .write() sends binary 
              Serial.println();  // new line
          }
          delay(10000);
          Serial.println();
     }

    delay(10);
}
