
byte potPin = A0;
int  potState =0;

void setup() {
  // put your setup code here, to run once:
   Serial.begin(9600);
   pinMode ( potPin, INPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  potState = analogRead(potPin);
  Serial.println(potState);
}
