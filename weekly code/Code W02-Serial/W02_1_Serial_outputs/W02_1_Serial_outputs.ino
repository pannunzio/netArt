int baudRate = 9600;

int myVar = 1;
char myChar = 'A';
String myString ="Hi there";

void setup() {
    Serial.begin(baudRate);
}

void loop() {
    Serial.print(0); // sends the number 0 over the serial port
    Serial.println(" hi! "); // prints literal with new line (NL) and carriage return (CR)
    Serial.print(myVar); // prints variable contents no NL or CR
    Serial.println(" next line "); // literal with new line and carriage return
    Serial.println(myChar); // char variable with NL & CR
    Serial.println(myString); // string with NL & CR
    Serial.println(); // blank NL & CR
    delay(1000);
}
