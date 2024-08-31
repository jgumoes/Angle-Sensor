#ifndef __DEVICE_SETTINGS_H__
#define __DEVICE_SETTINGS_H__

#include <WString.h>

struct {
  String deviceName = "Angle Sensor";
  uint16_t readInterval = 200;
  bool printNotify = true;
  bool printHolds = true;
  bool printOther = true;
  int16_t valueMin = 0;
  int16_t valueMax = 180;
} deviceSettings;

#endif