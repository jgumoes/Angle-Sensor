# About

# Plan

1. make the mcu read a sensor and indicate over BLE (test with nordic app)
2. make RN app connect to sensor and read data from mcu
3. store data in array and present list of values
4. Create mobx store

# theory of operation

The mcu reads the angle and constantly updates the screen. a hold button can toggle the updates. an upload button takes the value and queues it to be uploaded via BLE (probably through notify, and will keep notifying until the queue clears). The Bluetooth Sensor App will read the notifications and automatically update the database (probably a json file). When done, the readings should hopefully be accessible via file transfer, but could also be shared via email or google drive. If not, as a last resort, there is always firebase.

# setup

## environment

first, download Visual Studio Code.

### Bluetooth Sensor App (React Native)

follow the instructions here: https://reactnative.dev/docs/environment-setup?guide=native. Installing node through choco didn't install npm or npx for me, but installing through nvm works fine and is generally better-practice.

this doesn't use expo, so follow the instructions here: https://reactnative.dev/docs/running-on-device. I got an error saying "This adb server's $ADB_VENDOR_KEYS is not set". To fix this on my phone, I turned USB debugging off and on again while plugged in to my computer.

note: graddle version 8.5 is used as 8.6 and 8.7 give build errors (at least for windows)

### Angle Sensor (microcontroller)

install the "Platformio" extension for Visual Studio Code: https://marketplace.visualstudio.com/items?itemName=platformio.platformio-ide

Drivers will need to be installed to upload to the microcontroller (see below).

To upload the code, you'll need to press the "boot" button as you press the upload button (you can stop pressing when the writing starts).

#### ESP32 devkit v1 drivers

This is the generic board that can be bought cheaply off Amazon.

download the drivers from here: https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers?tab=downloads.

Unzip the folder and plug in the board. Go to the windows "Device Manager" and look in "Other Devices" or "Ports (COM)" for the unknown device (it will have a little warning triangle). Select it, and press the "update device driver" button along the top. Select the unziped folder. Platformio should be able to see the COM device (it'll be the Silicon Labs UART bridge).