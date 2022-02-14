// pot to dot

int potPin = A0;
int potState = 0 ;

void setup(){
  Serial.begin(9600);
  pinMode(potPin, INPUT);

}

void loop(){

  potState = analogRead( potPin );
  Serial.println(potState);
}
