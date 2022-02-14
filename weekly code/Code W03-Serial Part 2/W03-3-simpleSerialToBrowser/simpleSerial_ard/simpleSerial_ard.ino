//simple send
int count =0;

unsigned long timeNow, startTime;
unsigned long interval = 1000; // bigger = slower


void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
}

void loop() {

  timeNow = millis();

  if ( timeNow - startTime > interval){
    //Serial.println(count);
    count++;
    startTime+=interval;
    String s= "*";
    s+=count;
    s+=",";
    s+=2000;
    s+=",#";
   // Serial.println("*1000,2000,#");
    Serial.println(s);
  }
  
}
