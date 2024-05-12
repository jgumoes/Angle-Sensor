/**
 * Displays info about the connected device, or "Connect to device" view
 */

import React from 'react';
import {Button, Text, View} from 'react-native';

export const DeviceConnectionScreenName = 'DeviceConnectionScreen';

function DeviceConnectionScreen({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Device Connection Screen</Text>
      <Button title="Connect To Device" onPress={() => {}} />
    </View>
  );
}

export default DeviceConnectionScreen;
