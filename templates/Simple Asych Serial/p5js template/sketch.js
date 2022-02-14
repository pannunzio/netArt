// simple serial
// https://github.com/p5-serial/p5.serialport
// needs serial control app

let serial;
let portName = "/dev/tty.usbmodem142201"; //YOUR USB HERE
let theCanvas;
let cycleLength=50;
let duty = 0;
let oldCycle;

function setup() {
  theCanvas = createCanvas(255, 255);
  //theCanvas.position(0,0);

  // barebones serial implimentation
  serial = new p5.SerialPort();    // make a new instance of the
  serial.open(portName);           // open a serial port
  serial.on('data',serialEvent);

  setInterval(sendMessage,2000);    // send timer 2sec , (this line can't be in draw)
}

// listen
function serialEvent(){
   let currentString = serial.readLine(); // looks for newline
   trim(currentString); // remove white space
   if (!currentString) return; // if empty
   latestData = currentString; // for dislpay
   console.log("latestData " + latestData);
   // parsing message send via glue
     //elements = currentString.slice(1); // remove start byte
     //elements = elements.toString().split(","); // split on commas
     //xPos = elements[0]; // first element, assuming int
     //yPos = elements[1]; // second element, assuming interval
}



// send message
function sendMessage(){
  let message = ("*" + mouseX + ","+ mouseY+ ",#"); // onTime, offTime
  console.log("sending " + message);
  serial.write(message);
}


function draw() {
 background(0);
 fill(0,255,0);
 ellipse(mouseX,mouseY,25,25);
}
