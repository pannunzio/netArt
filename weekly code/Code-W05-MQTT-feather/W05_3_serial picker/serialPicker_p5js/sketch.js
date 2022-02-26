/*

p5.js Serial color picker

3 sliders select RGB values

the values are then sent to RGB LED attached to a feather

created for netArt by hex705 (steve daniels) , Feb 2022

*/

// for clarity -- all graphics variables AT BOTTOM of code

let serial;
let portName = "/dev/tty.SLAB_USBtoUART";
let theCanvas;
let latestData="";
let elements;

function setup() {
  // canvas basics
  cnv = createCanvas(1000,750);
  cnv.position(20, 100);
  colorMode(RGB, 255);

  //serial port
  serial = new p5.SerialPort();    // make a new instance of the serialport library
  serial.list();
  serial.on('list',  gotList);
  serial.open(portName);           // open a serial port

  // graphical elements
  inColor = color(50,150,255);
  myColor = color(100,10,127);
  sendColor = color(0,0,255);
  createSliders();
  createSendButton();
}


function gotList(thelist) {
  print("List of Serial Ports:");
  for (let i = 0; i < thelist.length; i++) {
    print(i + " " + thelist[i]);
  }
}

// message builder, specific to this project
function buildColorMessage(){
  // get color channels
  let r = floor(red(myColor));
  let g = floor(green(myColor));
  let b = floor(blue(myColor));
  // console.log('r '+r);
  // console.log('g '+g);
  // console.log('b '+b);

  // check for error in color
  if ( isNaN(r) || isNaN(g) || isNaN(b)){
    console.log ( 'malformed message');
  } else {
    // good message send it to shiftr
    let package = String( '*' + r +',' + g + ',' + b + ',#');
    sendSerial(package);
  }
}

function sendSerial(sendString){
  console.log(sendString);
  serial.write(sendString);
}

// drawing stuff
function draw() {
  background(255);
  drawScreen();
}

function createSendButton(){
  sendButton = createButton('Send Color');
  sendButton.style('font-size', '20px');
  sendButton.style('background-color', "orange");
  sendButton.position(475, 405); // 365, 475
  // this line attaches a mouse pressed event handler to the sendButton. This is an event driven JS solution (compare with sliders at end of code)
  sendButton.mousePressed(buildColorMessage);
}

function createSliders(){

  // create red selector
  rSlider = createSlider(0, 255, 127);
  rSlider.position(475, 325);
  rSlider.style("width", "127px");
  rSlider.id("rSlider");

  // create green selector
  gSlider = createSlider(0, 255, 127);
  gSlider.position(475, 350);
  gSlider.style("width", "127px");
  gSlider.id("gSlider");

  // create blue selector
  bSlider = createSlider(0, 255, 127);
  bSlider.position(475, 375);
  bSlider.style("width", "127px");
  bSlider.id("bSlider");
}

function drawScreen(){

  let topSpacer = 35;
  let sideSpacer = 25;
  let base = 300;


  // choose
  myColor = color(rValue, gValue,bValue);
  fill(myColor);
  rect(sideSpacer,topSpacer,base,base);

  // interface labels
  fill(87,87,87);
  textSize(32);
  text('choose a color ',sideSpacer,30);

  // chose slider labels
  textSize(17);
  text('Red    ('+rSlider.value()+')',350,240);
  text('Green ('+gSlider.value()+')',350,265);
  text('Blue    ('+bSlider.value()+')',350,290);


}

// generic way of tracking all the sliders
// not a very JS solution but it works.
function mouseReleased() {
  rValue = rSlider.value();
  gValue = gSlider.value();
  bValue = bSlider.value();
}


// graphical elements
let myColor;
let rSlider, rValue, gSlider, gValue, bSlider, bValue;
let receivedValue = 10;
let cnv,sendButton;
