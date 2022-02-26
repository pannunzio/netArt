/*
p5.js MQTT Client example

based on Tom Igoe's example:
https://tigoe.github.io/mqtt-examples/p5js-mqtt-client/

This example uses ::
p5.js: https://p5js.org/
Eclipse Paho MQTT client library: https://www.eclipse.org/paho/clients/js/

Creates an MQTT client that sends and receives MQTT messages.

The client is set up for use on the shiftr.io custom MQTT broker :    https://netartdemo.cloud.shiftr.io/

but has also been tested on https://test.mosquitto.org
created 12 June 2020
modified 20 Aug 2020
by Tom Igoe
Adapted for netArt by hex705 (steve daniels) , Jan 2022

*/

// how to parse the shiftr token
// general user:password@url

// MQTT://instanceName:instanceKey@shiftrURL

// shiftrURL (user.cloud.shiftr.io) --> broker.hostname ( this can be public)
// instanceKey --> creds.mqttPW -- > just token user / instance
// instanceName --> creds.mqttUser --> the secret part - never public

// MQTT client:
let mqttClient;

// MQTT broker location and port (shiftr):
let broker = {
  hostname: "public.cloud.shiftr.io", // socket needs specifc URL
  port: 443
};

// MQTT broker login creds
// these should be kept private
let creds = {
  clientID: DEVICE_NAME_IN_QUOTES,    // "myDeviceName"
  mqttUser: INSTANCE_USER,            //  "instanceName"
  mqttPW:   CHECK_DtwoL_FOR_MQTT_KEY, // secret - from token
};

// topic to subscribe to when you connect:
let publishTopic = "s-color";
let subscribeTopic = "s-color"; //"CLASSMATE_NAME";

// for clarity -- all graphics variables AT BOTTOM of code

function setup() {
  // canvas basics
  cnv = createCanvas(1000,750);
  cnv.position(20, 100);
  colorMode(RGB, 255);

  // Create an MQTT client:
  mqttClient = new Paho.MQTT.Client(
    broker.hostname,     // url
    Number(broker.port), // port
    creds.clientID       // device name
  );

  // connect to the MQTT broker:
  mqttClient.connect({
    onSuccess: onConnect, // callback function for when you connect
    userName: creds.mqttUser, // username
    password: creds.mqttPW, // password
    useSSL: true // use SSL
  });

  // set callback handlers for the client:
  mqttClient.onConnectionLost = onConnectionLost;
  mqttClient.onMessageArrived = onMessageArrived;

  // graphical elements
  inColor = color(50,150,255);
  myColor = color(100,10,127);
  sendColor = color(0,0,255);
  createSliders();
  createSendButton();
}

// called when the client connects
function onConnect() {
  console.log("client is connected");
  mqttClient.subscribe(subscribeTopic);
  // technically you can subscribe to as many topics as you want
  // this code is set up for one subscription
}

// called when the client loses its connection
function onConnectionLost(response) {
  if (response.errorCode !== 0) {
    console.log("onConnectionLost:" + response.errorMessage);
  }
}

// MQTT LISTEN -- called when a message arrives
function onMessageArrived(message) {

  debugIncomingMessage(message);

  // unpack the message - its a string of form [*,#]
  let currentString = message.payloadString; // looks for newline
  trim(currentString); // remove white space
  if (!currentString) return; // if empty
  latestData = currentString; // for dislpay

  // parse the incoming string into elements
  elements = currentString.slice(1); // remove start byte
  elements = elements.toString().split(","); // split on commas
      console.log('elements array');
      console.log(elements);

  // SPECIFIC FOR SENDING COLORS
  //  error check -- I was getting lots of NaN at one point
  if ( isNaN(elements[0]) || isNaN(elements[1]) || isNaN(elements[2])){ // r=='NaN' fails quitely -- oops
    console.log(' received malformed package');
  } else {
    inColor = color(elements[0], elements[1],elements[2]);
  }
}

// MQTT TALK -- called when you want to send a message:
function publishMqttMessage(topic,package) {

  // if the client is connected to the MQTT broker:
  if (mqttClient.isConnected()) {

      package = String(package);
      let publishMessage = new Paho.MQTT.Message(package);
      // choose the destination topic:
      console.log('topic '+topic);
      publishMessage.destinationName = topic;
      // send it:
      mqttClient.send(publishMessage);
      // print what you sent:
      console.log("sending :: " + publishMessage.payloadString);
    } // end color check
}

// look inside an incoming MQTT message
function debugIncomingMessage(m){
  // mqtt message (m) is an object with 2 parts :
  //      topic (destination name)
  //      content (payloadString)
  console.log('message received');
  console.log('raw message :: ');
  console.log(m); // look at this in console
  console.log("incomming topic :: " + m.destinationName);
  console.log("incomming payload :: " + m.payloadString);
}

// message builder, specific to this project
function buildColorMessage(){
  // get color channels
  let r = floor(red(sendColor));
  let g = floor(green(sendColor));
  let b = floor(blue(sendColor));
    // console.log('r '+r);
    // console.log('g '+g);
    // console.log('b '+b);

  // check for error in color
  if ( isNaN(r) || isNaN(g) || isNaN(b)){
    console.log ( 'malformed message');
  } else {
    // good message send it to shiftr
    let package = String( '*' + r +',' + g + ',' + b + ',#');
    publishMqttMessage(publishTopic,package);
  }
}

// drawing stuff

function draw() {
  background(255);
  drawScreen();
  drawAutoLabel();
}

function createSendButton(){
  sendButton = createButton('Manual');
  sendButton.style('font-size', '20px');
  sendButton.style('background-color', "orange");
  sendButton.position(725, 505); // 900, 475
  // this line attaches a mouse pressed event handler to the sendButton. This is an event driven JS solution (compare with sliders at end of code)
  sendButton.mousePressed(sendButtonPressed);
}

function sendButtonPressed(){
  if (sendOK == 0) {buildColorMessage()};
}

function sendModeUpdate(){
  console.log('sendmode update');

  if ( selectSlider.value() != lastSendState){
    if ( selectSlider.value() == 0) {
      // send mode
      sendButton.style('background-color', "orange");
      clearInterval(intervalId);
      sendOK = 0;
    } else {
      sendButton.style('background-color', "grey");
      intervalId = setInterval(buildColorMessage, 2000);
      sendOK = 1;
    }
  }
  lastSendState = sendOK;
}

function drawAutoLabel(){
  if ( sendOK == 1) {
    fill('orange');
  } else {
    fill('grey');
  }
  rect(885,405,75,28);//900,475 -- 710
  fill(0);
  textSize(20);
  text('AUTO',893,427);
}

function createSliders(){
  // create a slider for mix selection
  lastSendState = 0;
  selectSlider = createSlider(0, 1, 0);
  selectSlider.position(750, 475);
  selectSlider.style("width", "200px");
  selectSlider.input(sendModeUpdate);

  // create a slider for mix selection
  mixSlider = createSlider(0, 255, 255);
  mixSlider.position(175, 475);
  mixSlider.style("width", "325px");

  // create red selector
  rSlider = createSlider(0, 255, 127);
  rSlider.position(525, 350);
  rSlider.style("width", "127px");
  rSlider.id("rSlider");

  // create green selector
  gSlider = createSlider(0, 255, 127);
  gSlider.position(525, 375);
  gSlider.style("width", "127px");
  gSlider.id("gSlider");

  // create blue selector
  bSlider = createSlider(0, 255, 127);
  bSlider.position(525, 400);
  bSlider.style("width", "127px");
  bSlider.id("bSlider");
}

function drawScreen(){

  let topSpacer = 35;
  let sideSpacer = 25;
  let base = 300;

  // subscribe color
  fill(inColor);
  rect(sideSpacer,topSpacer,base,base);

  // choose
  myColor = color(rValue, gValue,bValue);
  fill(myColor);
  rect(base+2*sideSpacer,topSpacer,base,base-base/3);

  // publish color
  sendColor = lerpColor(inColor,myColor,mixValue);
  fill(sendColor);
  rect(2*base+3*sideSpacer,topSpacer,base,base);

  // interface labels
  fill(87,87,87);
  textSize(32);
  text('subscribe',sideSpacer,topSpacer-5);
  text('choose',sideSpacer*2+base,30);
  text('publish',sideSpacer*3+base*2,30);
  text('mix',90,395);
  text('mode',625,395)
  textSize(12);
  text('subscribe (network)',155,420);
  text('choose (self)',410,420);

  // chose slider labels
  textSize(17);
  text('Red    ('+rSlider.value()+')',410,265);
  text('Green ('+gSlider.value()+')',410,290);
  text('Blue    ('+bSlider.value()+')',410,315);

  // color labels
  textSize(12);
  text(red(inColor)+','+green(inColor)+','+blue(inColor),25,350);
  text(floor(red(sendColor))+','+floor(green(sendColor))+','+floor(blue(sendColor)),675,350);
}

// generic way of tracking all the sliders
// not a very JS solution but it works.
function mouseReleased() {
  mixValue = mixSlider.value()/255.0; // float 0 to 1 for value.
  rValue = rSlider.value();
  gValue = gSlider.value();
  bValue = bSlider.value();

}



// graphical elements
let inColor, myColor, sendColor;
let mixSlider, mixValue, selectSlider;
let sendOK = 0;
let lastSendState=0,intervalId;
let rSlider, rValue, gSlider, gValue, bSlider, bValue;
let receivedValue = 10;
let whenAreWe = 0;
let gotColor;
let elements;
let oldR, oldG, oldB;
let cnv,sendButton;
