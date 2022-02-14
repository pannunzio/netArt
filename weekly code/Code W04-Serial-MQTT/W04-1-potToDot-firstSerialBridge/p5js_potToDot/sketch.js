let serial;
let latestData = "waiting for data";

function setup() {
 createCanvas(1023, 100);

 serial = new p5.SerialPort();

 serial.list();
 serial.open('/dev/tty.usbmodem1433301');

 serial.on('connected', serverConnected);

 serial.on('list', gotList);

 serial.on('data', serialEvent);

 serial.on('error', gotError);

 serial.on('open', gotOpen);

 serial.on('close', gotClose);
}

function serverConnected() {
 print("Connected to Server");
}

function gotList(thelist) {
 print("List of Serial Ports:");

 for (let i = 0; i < thelist.length; i++) {
  print(i + " " + thelist[i]);
 }
}


function gotOpen() {
 print("Serial Port is Open");
}

function gotClose(){
 print("Serial Port is Closed");
 latestData = "Serial Port is Closed";
}

function gotError(theerror) {
 print(theerror);
}

function serialEvent() {
 let currentString = serial.readLine();
  trim(currentString);
 if (!currentString) return;
 console.log(currentString);
 latestData = currentString;
}

function draw() {
 background(0,0,0);
 fill(255,255,255);
 text(latestData, 10, 10);
 fill(255,0,0);
 ellipse(latestData, height/2,25,25);
 // Polling method
 /*
 if (serial.available() > 0) {
  let data = serial.read();
  ellipse(50,50,data,data);
 }
 */
}
