// log on info -- keep private

//   ***********************
//   do NOT share to github
//   ***********************


// wifi login info
//const char ssid[] = "YOUR_WIFI_NAME"; // wifi name
//const char password[] = "YOUR_WIFI_PASSWORD"; // wifi password
const char ssid[] = "YOUR_SSID"; // wifi name
const char password[] = "YOUR_WIFI_PASSWORD"; // wifi password

// shiftr login info
// https://www.shiftr.io/docs/manuals/arduino

// the class token in in D2L


// mqtt://esp32colorpick:4g82hgIsUZkQzAtm@esp32colorpick.cloud.shiftr.io

// path to the broker site (shiftr in this case)
const char broker[] = "public.cloud.shiftr.io"; // yes this url for SHFTR even with unique instance
int        port     = 1883; // 8883 secure

// user ID for the broker --> derived from links above
const char id[]     = "MY_ESP32_FEATHER";  // your shiftr device name
const char user[]   = "public";    // your shiftr instance
const char mqttPW[] = "public"; // your shiftr token secret
