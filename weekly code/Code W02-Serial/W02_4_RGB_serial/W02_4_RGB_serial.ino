/*
 * 
 * tested on genuino101 -- should work on arduino uno
 * s - dec 2019
 * 
 Serial RGB LED controller
 Context: Arduino
 
 Controls an RGB LED whose R, G and B legs are 
 connected to pins 11, 9, and 10, respectively.
 
 To control it, type 'r', 'g', or 'b' followed by
 the numerals 0 through 9. Each LED can be set at a brightness level 
 from 0 to 9.
 
 created 19 July 2010
 by Tom Igoe
 
 */

// constants to hold the output pin numbers:
const int redPin   = 6;
const int greenPin = 5;
const int bluePin  = 3;

int currentPin = 0; // current pin to be faded
int brightness = 0; // current brightness level
int flag;

void setup() {
  // initiate serial communication:
  Serial.begin(9600);
 
  // initialize the LED pins as outputs: 
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
}
void loop() {
  // if there's any serial data in the buffer, read a byte:

  if (Serial.available() > 0) {
    int inByte = Serial.read(); 
        
        Serial.print("received ");
        Serial.print(inByte);
        Serial.print("\t" );
        Serial.write(inByte);  
        Serial.println();
        flag = 0;
        
    // respond to the values 'r', 'g', 'b', or '0' throigh '9'.
    // you don't care about any other value:
    if (inByte == 'r') { // ascii 114, 'r'
      currentPin = redPin;
      flag =1; 
    }
    if (inByte == 'g') {
      currentPin = greenPin; 
      flag =1;
    }
    if (inByte == 'b') {
      currentPin = bluePin;
      flag =1; 
    } 

    if (inByte >= '0' && inByte <= '9') {
      // map the incoming byte value to the range of the analogRead() command:
      brightness = map(inByte, '0', '9', 0, 255);  
      // set the current pin to the current brightness:
      analogWrite(currentPin, brightness); 
      flag =1;   
    } 
    if ( flag==0  ) {
      Serial.write(inByte);
      Serial.println(" bad char");
    }
  }
}
