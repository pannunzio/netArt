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

// MQTT broker details (javascript object):
let broker = {
  hostname: "netart-2022.cloud.shiftr.io", // socket needs specifc URL
  port: 443,
};

// MQTT broker creds
// these should be kept private in .env
let creds = {
  clientID: DEVICE_NAME,             // device name - use quotes
  mqttUser: "netart-2022",           // instance
  mqttPW:   CHECK_DtwoL_FOR_MQTT_KEY // variable is in secrets tab
};

// topic to subscribe to when you connect:
let topic = "web-testTopic";

// graphical elements
let localDiv;
let remoteDiv;
let slider;
let sendValue;
let receivedValue = 10;

let cnv;

function setup() {
  // canvas basics
  cnv = createCanvas(400, 100);
  cnv.position(20, 100);

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


  // create a div for slider messages being sent:
  localDiv = createDiv("local messages will go here");
  localDiv.position(20, 20);
  localDiv.style("color", "#000000");

  // create a div for the rectangle fill being received:
  remoteDiv = createDiv("waiting for messages");
  remoteDiv.position(20, 110); // 80
  remoteDiv.style("color", "#000");

 // create a slider for value/color selection
  slider = createSlider(0, 255, 127);
  slider.position(20, 40);
  slider.style("width", "200px");
}

function draw() {
  background(255);
  fill(receivedValue, receivedValue, receivedValue);
  stroke(200);
  rect(0, height/2-10, width, 20);
}

function mouseReleased() {
  sendValue = slider.value();
  publishMqttMessage();
}


// MQTT Client callbacks

// called when the client connects
function onConnect() {
  localDiv.html("client is connected");
  mqttClient.subscribe(topic);
}

// called when the client loses its connection
function onConnectionLost(response) {
  if (response.errorCode !== 0) {
    localDiv.html("onConnectionLost:" + response.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  remoteDiv.html("receiving (and filling) :: " + message.payloadString);
  console.log("receiving (and filling) :: " + message.destinationName +" "+ message.payloadString );
  receivedValue = parseInt(message.payloadString);
}

// called when you want to send a message:
function publishMqttMessage() {
  // if the client is connected to the MQTT broker:
  if (mqttClient.isConnected()) {
    // start an MQTT message:
   let msg = String(sendValue);
   let message = new Paho.MQTT.Message(msg);
    // choose the destination topic:
    message.destinationName = topic;
    // send it:
    mqttClient.send(message);
    // print what you sent:
    localDiv.html("sending :: " + message.payloadString);
  }
}
