// what does the 'ln' in println mean anyway?

// created jan 2022, steve daniels (hex705)


void setup() {
  Serial.begin(9600);
}

void loop() {
  
  Serial.println("first line"); // ln = linefeed (LF), carriage return (CR)

  Serial.print("second line"); // cursor at end of line 

  Serial.write(10); // ascii LF
  Serial.write(13); // ascii CR
  
  Serial.print("third"); // starts at new line 
  Serial.write(9); // tab
  Serial.println("line"); // ln to bring us down one 

  Serial.println("end");
  while(1);
}
