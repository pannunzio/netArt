
int redPin = 6;
int greenPin = 5;
int bluePin = 3;

void setup() {
  // put your setup code here, to run once:
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);

}

void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite( redPin, 1 ); // HIGH
  delay(1000); 

  digitalWrite( redPin, 0); 
  digitalWrite( bluePin, HIGH);
  delay(1000); 

  digitalWrite( bluePin, LOW);
  digitalWrite( greenPin, 1); 
  delay(1000); 

  digitalWrite( greenPin, 0); 
  delay(1000); 

}
