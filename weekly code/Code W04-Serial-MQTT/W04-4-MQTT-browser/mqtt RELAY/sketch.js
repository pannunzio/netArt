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

// MQTT broker details:
let broker = {
  hostname: "netart-2022.cloud.shiftr.io", // socket needs specifc URL
  port: 443,
};

// MQTT broker creds
// these should be kept private in .env
let creds = {
  clientID: "DEVICE-NAME",           // device name
  mqttUser: "netart-2022",          // instance
  mqttPW: "Check D2L -- MQTT-KEY",       // secret
};

// topic to subscribe to when you connect:
let publishTopic = "PUBLISH-NAME";
let subscribeTopic = "SUBSCRIBE-NAME"; //"CLASSMATE_NAME";

// graphical elements
let inColor, myColor, sendColor;
let mixSlider, mixValue;
let rSlider, rValue, gSlider, gValue, bSlider, bValue;
let receivedValue = 10;
let whenAreWe = 0;
let gotColor;
let elements;
let oldR, oldG, oldB;

let cnv;

function setup() {
  // canvas basics
  cnv = createCanvas(820,510);
  cnv.position(20, 100);
  colorMode(RGB, 255);

  // Create an MQTT client:
  mqttClient = new Paho.MQTT.Client(
    broker.hostname,
    Number(broker.port),
    creds.clientID
  );

  // set callback handlers for the client:
  mqttClient.onConnectionLost = onConnectionLost;
  mqttClient.onMessageArrived = onMessageArrived;

  // connect to the MQTT broker:
  mqttClient.connect({
    onSuccess: onConnect, // callback function for when you connect
    userName: creds.mqttUser, // username
    password: creds.mqttPW, // password
    useSSL: true, // use SSL
  });

  // default colors
  inColor = color(50,150,255);
  myColor = color(100,10,127);
  sendColor = color(0,0,255);
  createSliders();

  setInterval(publishMqttMessage, 1000);
}


function draw() {
  background(255);
  drawScreen();
}


// called when the client connects
function onConnect() {
  console.log("client is connected");
  mqttClient.subscribe(subscribeTopic);
}

// called when the client loses its connection
function onConnectionLost(response) {
  if (response.errorCode !== 0) {
    console.log("onConnectionLost:" + response.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {

  // mqtt message has 2 parts :
  //      topic (destination name)
  //      content (payloadString)
  console.log("receiving (and filling) :: " + message.destinationName +" "+ message.payloadString );

  //receivedValue = parseInt(message.payloadString);
  // unpack the message
  let currentString = message.payloadString; // looks for newline
  trim(currentString); // remove white space
  //if (!currentString) return; // if empty
  latestData = currentString; // for dislpay
     //console.log("latestData " + latestData);

  // parse the incoming string
  elements = currentString.slice(1); // remove start byte
  elements = elements.toString().split(","); // split on commas
  console.log(elements);
  if ( elements[0] == 'NaN' || elements[1] == 'NaN' || elements[2] == 'NaN'){
    console.log(' received malformed package');
  } else {
    inColor = color(elements[0], elements[1],elements[2]);
  }

}

// called when you want to send a message:
function publishMqttMessage() {
  console.log('publishing');
  myColor = color(rValue, gValue,bValue);
  sendColor = lerpColor(inColor,myColor,mixValue);
  // if the client is connected to the MQTT broker:
  if (mqttClient.isConnected()) {

    // get color channels
   let r = floor(red(sendColor));
   let g = floor(green(sendColor));
   let b = floor(blue(sendColor));

     // check for error in color
     if ( r == 'NaN' || g == 'NaN' || b == 'NaN'){
       console.log ( 'malformed message');
     } else {

     let msg = String( '*' + r +',' + g + ',' + b + ',#');
     let message = new Paho.MQTT.Message(msg);
      // choose the destination topic:
      message.destinationName = publishTopic;
      // send it:
      mqttClient.send(message);
      // print what you sent:
      console.log("sending :: " + message.payloadString);
    } // end color check


}
}

// drawing stuff

function createSliders(){
  // create a slider for mix selection
   mixSlider = createSlider(0, 255, 255);
   mixSlider.position(130, 600);
   mixSlider.style("width", "127px");

   // create red selector
    rSlider = createSlider(0, 255, 127);
    rSlider.position(300, 450);
    rSlider.style("width", "127px");
    rSlider.id("rSlider");
    // create green selector
     gSlider = createSlider(0, 255, 127);
     gSlider.position(300, 475);
     gSlider.style("width", "127px");
     gSlider.id("gSlider");

     // create blue selector
      bSlider = createSlider(0, 255, 127);
      bSlider.position(300, 500);
      bSlider.style("width", "127px");
      bSlider.id("bSlider");
}

function drawScreen(){
  // incoming color
  fill(inColor);
  rect(10,40,150,400);

  // my color
  myColor = color(rValue, gValue,bValue);
  fill(myColor);
  rect(210,40,200,300);

  // send color
  sendColor = lerpColor(inColor,myColor,mixValue);
  fill(sendColor);
  rect(460,40,350,400);

  fill(87,87,87);
  textSize(32);
  text('subscribe',15,30);
  text('my color',220,30);
  text('publish',705,30);
  text('color mix',125,490);

  textSize(17);
  text('Red   ',210,365);
  text('Green ',210,390);
  text('Blue  ',210,415);
}

function mouseReleased() {
  mixValue = mixSlider.value()/255.0; // float 0 to 1 for value.
  rValue = rSlider.value();
  gValue = gSlider.value();
  bValue = bSlider.value();
}
