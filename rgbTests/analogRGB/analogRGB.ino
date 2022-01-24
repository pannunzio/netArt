
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
  for(int i = 0; i < 255; i++){
    analogWrite(redPin, i) ; 
    analogWrite(bluePin, 255-i); 
    delay(10); 
  }

  for(int i = 0; i < 255; i++){
    analogWrite(greenPin, i) ; 
    analogWrite(bluePin, 255-i); 
    delay(10); 
  }

  for(int i = 0; i < 255; i++){
    analogWrite(greenPin, i) ; 
    analogWrite(redPin, 255-i); 
    delay(10); 
  }

}
