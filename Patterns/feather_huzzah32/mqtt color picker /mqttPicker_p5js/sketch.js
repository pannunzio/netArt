/*

p5.js Serial color picker

3 sliders select RGB values

the values are then sent to RGB LED attached to a feather

created for netArt by hex705 (steve daniels) , Feb 2022

*/

// MQTT client:
let mqttClient;

// MQTT broker location and port (shiftr):
let broker = {
  hostname: URL_FROM_INSTANCE, // socket needs specifc URL
  port: 443
};

// MQTT broker login creds
// these should be kept private
let creds = {
  clientID: DEVICE_NAME_IN_QUOTES,    // "myDeviceName"
  mqttUser: INSTANCE_OR_USER_NAME,            //  "instanceName"
  mqttPW:   CHECK_DtwoL_FOR_MQTT_KEY // secret - from token
};

// topic to subscribe to when you connect:
let publishTopic   = "s-color";  // when pub/sub are same you loopback data


let theCanvas;
let latestData="";
let elements;

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

  // graphical elements
  myColor = color(100,10,127);
  createSliders();
  createSendButton();
}

// called when the client connects
function onConnect() {
  console.log("client is connected");
  // subscribe here :: technically you can subscribe to as many topics as
  // you want this code is set up for one subscription
}

// called when the client loses its connection
function onConnectionLost(response) {
  if (response.errorCode !== 0) {
    console.log("onConnectionLost:" + response.errorMessage);
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
    publishMqttMessage(publishTopic,package);
  }
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
