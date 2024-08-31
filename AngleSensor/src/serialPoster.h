#ifndef __SERIAL_POSTER_H__
#define __SERIAL_POSTER_H__
#include <Arduino.h>
#include <WString.h>

#include "deviceSettings.h"

void postNotify(String string){
  if(deviceSettings.printNotify){
    Serial.print("n:");
    Serial.println(string);
  }
};

void postHold(String string){
  if(deviceSettings.printHolds){
    Serial.print("h:");
    Serial.println(string);
  }
};

void postOther(String string){
  if(deviceSettings.printOther){
    Serial.print("o:");
    Serial.println(string);
  }
};

void postOther(String string1, String string2){
  if(deviceSettings.printOther){
    Serial.println("o:"+string1+string2);
    // Serial.print(string1);
    // Serial.println(string2);
  }
};

void postOther(String string1, String string2, String string3){
  if(deviceSettings.printOther){
    Serial.println("o:"+string1+string2+string3);
  }
};

void printNotify(bool enable){
  deviceSettings.printNotify = enable;
};

void printHolds(bool enable){
  deviceSettings.printHolds = enable;
};

void printOther(bool enable){
  deviceSettings.printOther = enable;
};

String boolToString(bool boolean){
  if(boolean){
    return "true";
  }
  else{
    return "false";
  }
};

void postSettings(){
  Serial.print("cs:{deviceName:\"");
  Serial.print(deviceSettings.deviceName);
  Serial.print("\",readInterval:");
  Serial.print(deviceSettings.readInterval);
  Serial.print(",printNotify:");
  Serial.print(boolToString(deviceSettings.printNotify));
  Serial.print(",printHolds:");
  Serial.print(boolToString(deviceSettings.printHolds));
  Serial.print(",printOther:");
  Serial.print(boolToString(deviceSettings.printOther));
  Serial.print(",valueMin:");
  Serial.print(deviceSettings.valueMin);
  Serial.print(",valueMax:");
  Serial.print(deviceSettings.valueMax);
  Serial.println("}");
};
#endif