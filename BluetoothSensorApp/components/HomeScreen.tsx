/**
 * the view when the app is initiated
 */

import React from 'react';
import {Button, Text, View} from 'react-native';
import {DeviceConnectionScreenName} from './DeviceConnectionScreen';
import {DataLogScreenName} from './DataLogScreen';

export const HomeScreenName = 'HomeScreen';

function HomeScreen({navigation}) {
  // TODO: decide what this screen should actually do
  // TODO: Device connection button text should change depending on connection status
  // TODO: data log button text should change depending on if one is active
  // TODO: data log button should go to the "Create New Log" view if none is active
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
      <Button
        onPress={() => navigation.navigate(DeviceConnectionScreenName)}
        title="Connect to Device"
      />
      <Button
        onPress={() => navigation.navigate(DataLogScreenName)}
        title="View Data Log"
      />
    </View>
  );
}

export default HomeScreen;
