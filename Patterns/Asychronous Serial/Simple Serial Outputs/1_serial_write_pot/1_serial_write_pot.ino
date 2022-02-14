// use a pot to control serial println / serial write
// you will need 2 circuits:
// LED and current limiting resistor on a PWM pin -- I chose pin ~6
// POT or variable resistor on pin A0

/* you wil lsee 3 representations of the POT position
  - voltage ( brighttness)
  - ascii (characters)
  - decimal mapping of ascii 
*/

// created jan 2022, steve daniels (hex705)


byte ledPin = 6;
byte potPin = A0;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
  pinMode(potPin, INPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  int state = analogRead(potPin)/4 ; 
  Serial.write(state);  // binary
  Serial.print('\t');
  Serial.println(state);// reflect var type in ASCII 
  
  analogWrite(ledPin, state);
  delay(100); 
}
