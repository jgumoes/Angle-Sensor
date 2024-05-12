/**
 * View the data recorded.
 * On initiation, should display "load log" or "create new log"
 *
 */

import React, {useState} from 'react';
import {
  Button,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

export const DataLogScreenName = 'DataLogScreen';

export function LogCreator({closeModal}) {
  console.log('Showing Log Creator Modal');
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text
        style={{
          color: 'black',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        Log Creater View
        <Button
          onPress={() => {
            activeLog.title = 'Test Log';
            activeLog.headers = ['Var 1', 'Var 2'];
            var randLogValues: number[][] = [];
            const randValue = () => {
              return Math.round(Math.random() * 10000) / 100;
            };
            for (let i = 0; i <= 30; i++) {
              randLogValues.push([randValue(), randValue()]);
            }
            // activeLog.data = testLogValues;
            activeLog.data = randLogValues;
            closeModal();
          }}
          title="Load Test Values"
        />
      </Text>
    </View>
  );
}

export function ActiveLog() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Active Log Screen</Text>
    </View>
  );
}

const testLogValues = [
  [1, 8],
  [2, 4],
  [3, 7],
  [4, 10],
  [5, 3.3],
];

interface ActiveLog_t {
  title: string;
  headers: string[];
  data: number[][];
}
var activeLog: ActiveLog_t = {
  title: '',
  headers: [],
  data: [],
};

function ReadSensorValue() {
  // TODO: there should be some kind of style change to distinguish between indicate and notify
  return (
    <Pressable
      style={styles.sensorValueContainer}
      onPress={() => console.log('TODO: show sensor details?')}>
      <Text style={styles.sensorValueText}>TODO: Show Sensor Value</Text>
    </Pressable>
  );
}

function LogDivider() {
  return <View style={styles.logDivider} />;
}

function LogHeader({title}: {title: string}) {
  return (
    <Pressable onPress={() => console.log('TODO: open document details modal')}>
      <Text style={styles.logHeader}>{title}</Text>
    </Pressable>
  );
}
function DataLogView() {
  const numOfValues = activeLog.headers.length;
  console.log('numOfValues: ', numOfValues);
  console.log('headers: ', activeLog.headers);
  const valuesWidth =
    (useWindowDimensions().width - styles.logID.width) / numOfValues;
  return (
    <FlatList
      data={activeLog.data}
      ListHeaderComponent={LogHeader({title: activeLog.title})}
      renderItem={({item, index}) => (
        <View style={styles.logRow}>
          <Pressable
            style={styles.logID}
            onPress={() => console.log('TODO: delete row modal popup')}>
            <Text adjustsFontSizeToFit={true} style={styles.logText}>
              {index}
            </Text>
          </Pressable>
          {item.map(value => {
            console.log('Printing item ', index, ': ', value);
            return (
              <Pressable
                style={[styles.logValue, {width: valuesWidth}]}
                onPress={() =>
                  console.log('TODO: change/delete log value modal')
                }>
                <Text adjustsFontSizeToFit={true} style={styles.logText}>
                  {value}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
      ItemSeparatorComponent={LogDivider}
    />
  );
}

function DataLogScreen({navigation}) {
  const [createLogModal, setCreateLogModal] = useState(false);
  if (activeLog.data.length === 0) {
    return (
      <View style={styles.dataLogScreen}>
        <Button
          title="Create New Log"
          onPress={() => {
            setCreateLogModal(!createLogModal);
          }}
        />
        <Modal
          visible={createLogModal}
          onRequestClose={() => {
            setCreateLogModal(!createLogModal);
          }}>
          <LogCreator closeModal={() => setCreateLogModal(false)} />
        </Modal>
      </View>
    );
  }
  return (
    <View style={styles.dataLogScreen}>
      <DataLogView />
      <ReadSensorValue />
    </View>
  );
}

const styles = StyleSheet.create({
  logText: {
    fontSize: 26,
    color: 'black',
  },
  logRow: {
    width: '100%',
    flexDirection: 'row',
    // alignContent: 'space-between',
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  logID: {
    backgroundColor: '#8080803f',
    width: 60,
    alignItems: 'center',
  },
  logValue: {
    borderColor: 'black',
    borderLeftWidth: 1,
    // borderWidth: 1,
    flexGrow: 1,
    flexShrink: 1,
    alignItems: 'center',
  },
  logDivider: {height: 2, width: '100%', backgroundColor: 'black'},
  dataLogScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logHeader: {
    color: 'black',
    fontSize: 30,
    textAlign: 'center',
    width: '100%',
    borderColor: 'black',
    borderTopWidth: 3,
    borderBottomWidth: 3,
  },
  sensorValueContainer: {
    borderColor: 'blue',
    backgroundColor: '#ffa60046',
    borderTopWidth: 3,
    width: '100%',
    height: 100,
    justifyContent: 'center',
  },
  sensorValueText: {
    color: 'blue',
    textAlign: 'center',
    fontSize: 30,
  },
});

export default DataLogScreen;
