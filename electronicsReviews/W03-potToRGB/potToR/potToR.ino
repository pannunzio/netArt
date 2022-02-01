// set up a pot -- red code only 

int rPot = A0; //  where is circuit 
int rState = 0;  

int rLed = 6;

void setup() {
  // put your setup code here, to run once:
  pinMode(rPot, INPUT);
  pinMode(rLed, OUTPUT);

  Serial.begin(9600); 
}

void loop() {
  // put your main code here, to run repeatedly:

  rState = analogRead(rPot);
  Serial.println(rState);
  analogWrite(rLed, rState/4);
   
}
