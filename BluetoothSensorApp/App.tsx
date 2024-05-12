// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// import React from 'react';
// import type {PropsWithChildren} from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
// } from 'react-native';

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

// import BLEManager from 'react-native-ble-manager';

// BLEManager.start({showAlert: false}).then(() => {
//   // Success code
//   console.log('Module initialized');
// });

// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;

// function Section({children, title}: SectionProps): React.JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// }

// function App(): React.JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   return (
//     <SafeAreaView style={backgroundStyle}>
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />
//       <ScrollView
//         contentInsetAdjustmentBehavior="automatic"
//         style={backgroundStyle}>
//         <Header />
//         <View
//           style={{
//             backgroundColor: isDarkMode ? Colors.black : Colors.white,
//           }}>
//           <Section title="Step One">
//             Edit <Text style={styles.highlight}>App.tsx</Text> to change this
//             screen and then come back to see your edits.
//           </Section>
//           <Section title="See Your Changes">
//             <ReloadInstructions />
//           </Section>
//           <Section title="Debug">
//             <DebugInstructions />
//           </Section>
//           <Section title="Learn More">
//             Read the docs to discover what to do next:
//           </Section>
//           <LearnMoreLinks />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

// export default App;

import 'react-native-gesture-handler'; // this must be at the top
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
// import ScanDevicesScreen from './components/ScanDevicesScreen';
// import PeripheralDetailsScreen from './components/PeripheralDetailsScreen';
import HomeScreen, { HomeScreenName } from './components/HomeScreen';
import DataLogScreen, { DataLogScreenName } from './components/DataLogScreen';
import DeviceConnectionScreen, { DeviceConnectionScreenName } from './components/DeviceConnectionScreen';
import { StyleSheet } from 'react-native';

// const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
// const RootStack = createNativeStackNavigator();

// const DrawerNavigator = () => {
//   return (
//     <Drawer.Navigator>
//       <Drawer.Screen name="Home" component={HomeScreen} />
//       <Drawer.Screen name="Data Log" component={DataLogScreen} />
//       <Drawer.Screen
//         name="Device Connection"
//         component={DeviceConnectionScreen}
//       />
//     </Drawer.Navigator>
//   );
// };

// const RootStackScreen = () => {
//   return (
//     <NavigationContainer>
//       <RootStack.Navigator mode="modal">
//         <RootStack.Screen
//           name="Main"
//           component={DrawerNavigator}
//           options={{headerShown: false}}
//         />
//         <RootStack.Screen name="HowToPlayModal" component={HowToPlayModal} />
//       </RootStack.Navigator>
//     </NavigationContainer>
//   );
// };

const App = () => {
  return (
    // <NavigationContainer>
    //   <Drawer.Navigator>
    //     <Drawer.Screen name="ScanDevices" component={ScanDevicesScreen} />
    //     <Drawer.Screen
    //       name="PeripheralDetails"
    //       component={PeripheralDetailsScreen}
    //     />
    //   </Drawer.Navigator>
    // </NavigationContainer>

    <NavigationContainer>
      <Drawer.Navigator initialRouteName={HomeScreenName}>
        <Drawer.Screen name={HomeScreenName} component={HomeScreen} />
        <Drawer.Screen name={DataLogScreenName} component={DataLogScreen} />
        <Drawer.Screen
          name={DeviceConnectionScreenName}
          component={DeviceConnectionScreen}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
