import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import BleManager, {
  Characteristic,
  PeripheralInfo,
} from 'react-native-ble-manager';
import {Colors} from 'react-native/Libraries/NewAppScreen';

// Define interfaces for your peripheral's properties
// interface Characteristic {
//   characteristic: string;
//   // Add any other characteristic properties you need
// }

// interface Service {
//   uuid: string;
//   characteristics: Characteristic[];
//   // Add any other service properties you need
// }

// Props expected by PeripheralDetails component
interface PeripheralDetailsProps {
  route: {
    params: {
      peripheralData: PeripheralInfo;
    };
  };
}

const RenderCharacteristic = (
  index: number,
  char: Characteristic,
  peripheralUUID: string,
  serviceUUID: string,
  characteristicUUID: string,
) => {
  const [currentValue, updateCurrentValue] = useState(0);

  const BleManagerModule = NativeModules.BleManager;

  useEffect(() => {
    const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
    // Update the ref with the latest value of props.value
    // valueRef.current = value;

    async function createNotifyListener() {
      await BleManager.startNotification(
        peripheralUUID,
        serviceUUID,
        characteristicUUID,
      );

      bleManagerEmitter.addListener(
        'BleManagerDidUpdateValueForCharacteristic',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({value, peripheral, characteristic, service}) => {
          // Convert bytes array to string
          //const data = bytesToString(value);
          if (characteristic === characteristicUUID) {
            updateCurrentValue(value);
            console.log(
              `(${new Date().getTime()}) Received ${value} for characteristic ${characteristic}`,
            );
          }
        },
      );
    }

    if (char.properties.Notify || char.properties.Indicate) {
      createNotifyListener();
    }

    // Cleanup: remove the event listener
    return () => {
      bleManagerEmitter.removeAllListeners(
        'BleManagerDidUpdateValueForCharacteristic',
      );
    };
  }, [
    BleManagerModule,
    char.properties.Indicate,
    char.properties.Notify,
    characteristicUUID,
    peripheralUUID,
    serviceUUID,
  ]);

  return (
    <View key={index} style={styles.characteristicContainer}>
      <Text style={styles.characteristicTitle}>
        Characteristic: {char.characteristic}
      </Text>
      <Text style={{color: Colors.black}}>
        Properties: {Object.values(char.properties).join(', ')}
        {(char.properties.Notify || char.properties.Indicate) &&
          '\nValue: ' + currentValue}
      </Text>
    </View>
  );
};

const PeripheralDetailsScreen = ({route}: PeripheralDetailsProps) => {
  const peripheralData = route.params.peripheralData;
  console.log('peripheralData:', JSON.stringify(peripheralData, null, 2));

  // Function to render characteristics for a given service
  const RenderCharacteristicsForService = (serviceUUID: string) => {
    const characteristics = peripheralData.characteristics ?? [];
    return characteristics
      .filter(char => char.service === serviceUUID)
      .map((char, index) =>
        // <View key={index} style={styles.characteristicContainer}>
        //   <Text style={styles.characteristicTitle}>
        //     Characteristic: {char.characteristic}
        //   </Text>
        //   <Text style={{color: Colors.black}}>
        //     Properties: {Object.values(char.properties).join(', ')}
        //   </Text>
        // </View>
        RenderCharacteristic(
          index,
          char,
          peripheralData.id,
          char.service,
          char.characteristic,
        ),
      );
  };

  return (
    <ScrollView
      style={styles.scrollViewStyle}
      contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Peripheral Details</Text>
      <Text style={styles.detail}>name: {peripheralData.name}</Text>
      <Text style={styles.detail}>id: {peripheralData.id}</Text>
      <Text style={styles.detail}>rssi: {peripheralData.rssi}</Text>

      <Text style={[styles.title, styles.titleWithMargin]}>Advertising</Text>
      <Text style={styles.detail}>
        localName: {peripheralData.advertising.localName}
      </Text>
      <Text style={styles.detail}>
        txPowerLevel: {peripheralData.advertising.txPowerLevel}
      </Text>
      <Text style={styles.detail}>
        isConnectable:{' '}
        {peripheralData.advertising.isConnectable ? 'true' : 'false'}
      </Text>
      <Text style={styles.detail}>
        serviceUUIDs: {peripheralData.advertising.serviceUUIDs}
      </Text>

      <Text style={[styles.title, styles.titleWithMargin]}>
        Services && Characteristics
      </Text>
      {peripheralData.services?.map((service, index) => (
        <View key={index} style={styles.serviceContainer}>
          <Text style={styles.serviceTitle}>Service: {service.uuid}</Text>
          {RenderCharacteristicsForService(service.uuid)}
        </View>
      ))}
    </ScrollView>
  );
};

// Add some basic styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    color: Colors.black,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.black,
  },
  titleWithMargin: {
    marginTop: 20, // Adjust this value as needed
    color: Colors.black,
  },
  detail: {
    marginTop: 5,
    fontSize: 16,
    color: Colors.black,
  },
  serviceContainer: {
    marginTop: 15,
    color: Colors.black,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
  },
  characteristic: {
    fontSize: 16,
    color: Colors.black,
  },
  scrollViewStyle: {
    flex: 1,
    color: Colors.black,
  },
  contentContainer: {
    padding: 20,
    color: Colors.black,
  },
  characteristicContainer: {
    marginTop: 10,
    color: Colors.black,
  },
  characteristicTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.black,
  },
  propertyText: {
    fontSize: 14,
    marginLeft: 10,
    color: Colors.black,
  },
});

export default PeripheralDetailsScreen;
