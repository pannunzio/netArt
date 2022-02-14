// 2 pots set RGB color
// pots on arduino A0--> xPos, A1 -->yPos
// RGB on arduino r-->6,g-->5,b-->3

/* code blocks
 variables
 setup
 draw
 sendColor
 serialEvent
 drawAltBG
 

*/
let serial;
let portName = "/dev/tty.usbmodem142201";
let theCanvas;
let latestData="";
let elements;
let newData, xPos,yPos, quadrant, lastQuadrant;

function setup() {

  theCanvas = createCanvas(512, 512);

  //serial port
  serial = new p5.SerialPort();    // make a new instance of the serialport library
  serial.list();
  serial.on('list',  gotList);
  serial.open(portName);           // open a serial port

  // serial callbacks at bottom of code.
  serial.on('connected', serverConnected);
  serial.on('data',  serialEvent);  // callback for when new data arrives
  serial.on('error', serialError); // callback for errors
  serial.on('open',  gotOpen);
  serial.on('close', gotClose);
}


function draw() {
 // background
 noStroke();
 background(80,80,80,20);
 drawAltBG();

 // display text
 fill(255,255,255);
 text(latestData, 10, 15); // raw string
 text(xPos,100,15);
 text(yPos,200,15);

 // draw ball
 fill(0,0,0);
 ellipse(xPos,yPos,25,25);

 // // check BALL location
 // pink
  if ((xPos < width/2) && (yPos < height/2)) {
    //console.log("pink");
    quadrant = 0;
    sendColor(75,0,30);
  }

  // orange
  if ((xPos > width/2) && (yPos < height/2)) {
    //console.log("orange");
    quadrant = 1;
    sendColor(200,25,0);
  }

  // teal
  if ((xPos < width/2) && (yPos > height/2)) {
    //console.log("teal");
    quadrant = 2;
    sendColor(20,150,100);
  }
  // purple
  if ((xPos > width/2) && (yPos > height/2)) {
    //console.log("purple");
    quadrant = 3;
    sendColor(50,0,40);
  }
}

// send color to arduino
function sendColor(r, g, b){
  //console.log("in send color ");
  if ( lastQuadrant != quadrant ) { // send only with new color
    console.log("send " + quadrant);
    let sendString = '*' + r + ',' + g + ',' + b + '#'; // use protocol
    console.log(sendString);
    serial.write(sendString);
    newColor = 0;
  }
 lastQuadrant = quadrant;
}

function serialEvent() {
   let currentString = serial.readLine(); // looks for newline
   trim(currentString); // remove white space
   if (!currentString) return; // if empty
   latestData = currentString; // for dislpay
      //console.log("latestData " + latestData);
   elements = currentString.slice(1); // remove start byte
   elements = elements.toString().split(","); // split on commas
   xPos = elements[0]/2; // scale for screen
   yPos = elements[1]/2; // scale for screen
}

function drawAltBG(){
    fill(255,20,100);
    rect(0,0,width/2, height/2);
    fill(255,100,0);
    rect(width/2,0,width,height/2);
    fill(0,150,150);
    rect(0, height/2, width/2,height);
    fill(100,0,100);
    rect(width/2,height/2,width,height);
}


// serial boiler plate code
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

function serialError(theerror) {
 print(theerror);
}
