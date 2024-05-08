/*
  copied and tweaked example here: https://github.com/h2zero/NimBLE-Arduino/blob/release/1.4/examples/NimBLE_Server/NimBLE_Server.ino)
*/
#define CONFIG_NIMBLE_CPP_ENABLE_RETURN_CODE_TEXT

#include <NimBLEDevice.h>
#include <vector>
#include <cstdint>

std::vector<unsigned char> intToBytes(int value) {
    std::vector<unsigned char> bytes;
    while (value != 0) {
        bytes.insert(bytes.begin(), static_cast<unsigned char>(value & 0xFF));
        value >>= 8;
    }
    return bytes;
}

struct {
  const char* notifyLevel = NOTIFYVOLTAGELEVEL_UUID;
  const char* indicateLevel = INDICATEVOLTAGELEVEL_UUID;
  const char* voltageLevelService = VOLTAGELEVELSERVICE_UUID;
} uuid;

static NimBLEServer* pServer;

class ServerCallbacks: public NimBLEServerCallbacks {
    void onConnect(NimBLEServer* pServer) {
        Serial.println("Client connected");
        Serial.println("Multi-connect support: start advertising");
        NimBLEDevice::startAdvertising();
    };
    /** Alternative onConnect() method to extract details of the connection.
     *  See: src/ble_gap.h for the details of the ble_gap_conn_desc struct.
     */
    void onConnect(NimBLEServer* pServer, ble_gap_conn_desc* desc) {
        Serial.print("Client address: ");
        Serial.println(NimBLEAddress(desc->peer_ota_addr).toString().c_str());
        /** We can use the connection handle here to ask for different connection parameters.
         *  Args: connection handle, min connection interval, max connection interval
         *  latency, supervision timeout.
         *  Units; Min/Max Intervals: 1.25 millisecond increments.
         *  Latency: number of intervals allowed to skip.
         *  Timeout: 10 millisecond increments, try for 5x interval time for best results.
         */
        pServer->updateConnParams(desc->conn_handle, 24, 48, 0, 60);
    };
    void onDisconnect(NimBLEServer* pServer) {
        Serial.println("Client disconnected - start advertising");
        NimBLEDevice::startAdvertising();
    };
    void onMTUChange(uint16_t MTU, ble_gap_conn_desc* desc) {
        Serial.printf("MTU updated: %u for connection ID: %u\n", MTU, desc->conn_handle);
    };
};

/** Handler class for characteristic actions */
class CharacteristicCallbacks: public NimBLECharacteristicCallbacks {
    void onRead(NimBLECharacteristic* pCharacteristic){
        Serial.print(pCharacteristic->getUUID().toString().c_str());
        Serial.print(": onRead(), value: ");
        Serial.println(pCharacteristic->getValue().c_str());
    };

    void onWrite(NimBLECharacteristic* pCharacteristic) {
        Serial.print(pCharacteristic->getUUID().toString().c_str());
        Serial.print(": onWrite(), value: ");
        Serial.println(pCharacteristic->getValue().c_str());
    };
    // /** Called before notification or indication is sent,
    //  *  the value can be changed here before sending if desired.
    //  */
    // void onNotify(NimBLECharacteristic* pCharacteristic) {
    //     Serial.println("Sending notification to clients");
    // };

    // void onIndicate(NimBLECharacteristic* pCharacteristic){
    //   Serial.print("indicating");
    // }


    /** The status returned in status is defined in NimBLECharacteristic.h.
     *  The value returned in code is the NimBLE host return code.
     */
    void onStatus(NimBLECharacteristic* pCharacteristic, Status status, int code) {
        String str = ("Notification/Indication status code: ");
        str += status;
        str += ", return code: ";
        str += code;
        str += ", ";
        str += NimBLEUtils::returnCodeToString(code);
        Serial.println(str);
        if(status == SUCCESS_INDICATE){
          Serial.println("value indicated");
        }
        if(status == SUCCESS_NOTIFY){
          Serial.println("value notified");
        }
    };

    void onSubscribe(NimBLECharacteristic* pCharacteristic, ble_gap_conn_desc* desc, uint16_t subValue) {
        String str = "Client ID: ";
        str += desc->conn_handle;
        str += " Address: ";
        str += std::string(NimBLEAddress(desc->peer_ota_addr)).c_str();
        if(subValue == 0) {
            str += " Unsubscribed to ";
        }else if(subValue == 1) {
            str += " Subscribed to notfications for ";
        } else if(subValue == 2) {
            str += " Subscribed to indications for ";
        } else if(subValue == 3) {
            str += " Subscribed to notifications and indications for ";
        }
        str += std::string(pCharacteristic->getUUID()).c_str();

        Serial.println(str);
    };
};

/** Handler class for descriptor actions */
class DescriptorCallbacks : public NimBLEDescriptorCallbacks {
    void onWrite(NimBLEDescriptor* pDescriptor) {
        std::string dscVal = pDescriptor->getValue();
        Serial.print("Descriptor witten value:");
        Serial.println(dscVal.c_str());
    };

    void onRead(NimBLEDescriptor* pDescriptor) {
        Serial.print(pDescriptor->getUUID().toString().c_str());
        Serial.println(" Descriptor read");
    };
};


/** Define callback instances globally to use for multiple Charateristics \ Descriptors */
static DescriptorCallbacks dscCallbacks;
static CharacteristicCallbacks chrCallbacks;

long previousNotifyMillis = 0;  // last time the battery level was checked, in ms
long nextButtonCheckMillis = 0;  // last time the battery level was checked, in ms

int readVoltageLevel(){
  int battery = analogRead(GPIO_NUM_15);
  return map(battery, 0, 1023, 0, 100);
}

void notifyVoltageLevel(NimBLEService* pSvc) {
  /* Read the current voltage level on the A0 analog input pin.
     This is used here to simulate the charge level of a battery.
  */
  int voltageLevel = readVoltageLevel();

  //if (voltageLevel != oldBatteryLevel) {      // if the battery level has changed
  Serial.print("Battery Level % is now: "); // print it
  Serial.println(voltageLevel);
  //currentValueChar.writeValue(voltageLevel);  // and update the battery level characteristic

  NimBLECharacteristic* pChr = pSvc->getCharacteristic(uuid.notifyLevel);
  if(pChr){
    pChr->notify(intToBytes(voltageLevel));
    // pChr->notify(true);
  }
}

const uint millisBetweenHolds = 1000;
const uint millisBetweenButtonReads = 100;

/**
 * @brief check the button every 0.1 seconds. TODO: limit to rising edges only
 * 
 * @param currentMillis 
 */
void checkButton(long currentMillis, NimBLEService* pSvc){
  if(currentMillis >= nextButtonCheckMillis){
    if(digitalRead(GPIO_NUM_5)){
      int voltageLevel = readVoltageLevel();
      // TODO: read byte values direct from register
      std::vector<uint8_t> voltageVector = intToBytes(voltageLevel);
      Serial.print("Indicating value: ");
      Serial.println(voltageLevel);

      //holdValueChar.writeValue(voltageLevel);
      NimBLECharacteristic* pChr = pSvc->getCharacteristic(uuid.indicateLevel);
      if(pChr){
        // pChr->(voltageLevel);
        pChr->indicate(voltageVector);
      }

      nextButtonCheckMillis = currentMillis + millisBetweenHolds; // limit successful reads to one per second
    }
    else{
      nextButtonCheckMillis = currentMillis + millisBetweenButtonReads;
    }
  }
}

void indicationRecievedCallback(BLEDevice central, BLECharacteristic characteristic){
  Serial.println("indication recieved");
}


void setup() {
    Serial.begin(9600);
    Serial.println("Starting NimBLE Server");

    /** sets device name */
    NimBLEDevice::init("VoltageLevelReader");

    /** Optional: set the transmit power, default is 3db */
#ifdef ESP_PLATFORM
    NimBLEDevice::setPower(ESP_PWR_LVL_P9); /** +9db */
#else
    NimBLEDevice::setPower(9); /** +9db */
#endif

    /** 2 different ways to set security - both calls achieve the same result.
     *  no bonding, no man in the middle protection, secure connections.
     *
     *  These are the default values, only shown here for demonstration.
     */
    NimBLEDevice::setSecurityAuth(false, false, false);

    pServer = NimBLEDevice::createServer();
    pServer->setCallbacks(new ServerCallbacks());

    NimBLEService* pVoltageLevelService = pServer->createService(uuid.voltageLevelService);
    NimBLECharacteristic* pCurrentValueChar = pVoltageLevelService->createCharacteristic(
                                               uuid.notifyLevel,
                                               NIMBLE_PROPERTY::READ |
                                               NIMBLE_PROPERTY::NOTIFY,
                                               2
                                              );

    pCurrentValueChar->setValue(0);
    pCurrentValueChar->setCallbacks(&chrCallbacks);

     NimBLECharacteristic* pHoldValueChar = pVoltageLevelService->createCharacteristic(
                                               uuid.indicateLevel,
                                               NIMBLE_PROPERTY::READ |
                                               NIMBLE_PROPERTY::INDICATE,
                                               2
                                              );

    pHoldValueChar->setValue(0);  // TODO: remove
    pHoldValueChar->setCallbacks(&chrCallbacks);

    /** Start the services when finished creating all Characteristics and Descriptors */
    pVoltageLevelService->start();
    // pBaadService->start();

    NimBLEAdvertising* pAdvertising = NimBLEDevice::getAdvertising();
    /** Add the services to the advertisment data **/
    pAdvertising->addServiceUUID(pVoltageLevelService->getUUID());
    // pAdvertising->addServiceUUID(pBaadService->getUUID());
    /** If your device is battery powered you may consider setting scan response
     *  to false as it will extend battery life at the expense of less data sent.
     */
    pAdvertising->setScanResponse(true);
    pAdvertising->start();

    Serial.println("Advertising Started");
}

void loop() {
  // wait for a Bluetooth® Low Energy central
  //BLEDevice central = BLE.central();

  // if a central is connected to the peripheral:
  if (pServer->getConnectedCount()) {
    Serial.print("Connected to central: ");
    // print the central's BT address:
    // Serial.println(central.address());
    // turn on the LED to indicate the connection:
    digitalWrite(LED_BUILTIN, HIGH);

    // check the battery level every 200ms
    // while the central is connected:
    while (pServer->getConnectedCount()) {
      NimBLEService* pSvc = pServer->getServiceByUUID(uuid.voltageLevelService);
      long currentMillis = millis();
      // if 200ms have passed, check the battery level:
      checkButton(currentMillis, pSvc);
      if (currentMillis - previousNotifyMillis >= 500) {
        previousNotifyMillis = currentMillis;
        notifyVoltageLevel(pSvc);
      }
    }
    // when the central disconnects, turn off the LED:
    digitalWrite(LED_BUILTIN, LOW);
    Serial.print("Disconnected from central: ");
    //Serial.println(central.address());
  }
}