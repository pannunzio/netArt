// 3 pots control RGB led
// LED PINS r,g,b -->  6,5,3
// pot pins r,g,b --> A0,A1,A2


int rPot = A0; //  where is circuit 
int rState = 0;  
int rLed = 6;

int gPot = A1; //  where is circuit 
int gState = 0;  
int gLed = 5;

int bPot = A2; //  where is circuit 
int bState = 0;  
int bLed = 3;

void setup() {
  // put your setup code here, to run once:
  pinMode(rPot, INPUT);
  pinMode(rLed, OUTPUT);

  pinMode(gPot, INPUT);
  pinMode(gLed, OUTPUT);

  pinMode(bPot, INPUT);
  pinMode(bLed, OUTPUT);

  Serial.begin(9600); 
}

void loop() {


  rState = analogRead(rPot);
  Serial.print(rState);
  analogWrite(rLed, rState/4);
  Serial.print("\t");
  
  gState = analogRead(gPot);
  Serial.print(gState);
  analogWrite(gLed, gState/4);
  Serial.print("\t");
  
  bState = analogRead(bPot);
  Serial.println(bState);
  analogWrite(bLed, bState/4);
   
}
