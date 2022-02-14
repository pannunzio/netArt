// simple serial
// https://github.com/p5-serial/p5.serialport

let serial;
let portName = "/dev/tty.usbmodem142201";
let theCanvas;
let latestData="";

function setup() {
  theCanvas = createCanvas(512, 512);

  serial = new p5.SerialPort();    // make a new instance of the
  serial.open(portName);           // open a serial port
  serial.on('data',  serialEvent); // callback for when new data arrives
}

function serialEvent() {
   let currentString = serial.readLine(); // looks for newline
   //trim(currentString); // remove white space
   if (!currentString) return; // if empty or error
   latestData = currentString;
   console.log("latestData " + latestData);
}

function draw() {
 background(80,80,80);
 fill(255,255,255);
 text(latestData, 10, 15);

 let message  = latestData.slice(1); // remove start byte in protocol
 let elements = message.toString().split(","); // gives array elements[]
 text(elements[0],10,35);
 text(elements[1],10,55);

 fill(255,0,0);
 ellipse(elements[0]/2, elements[1]/2,30,30);

}
