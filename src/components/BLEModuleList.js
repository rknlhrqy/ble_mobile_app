import React, { Component } from 'react';
import {
  View,
  ScrollView,
  ListView,
  Text,
  TouchableHighlight,
  StyleSheet
} from 'react-native';

import Log from '../utils/Log';

export default class BLEModuleList extends Component {

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
  }

  render() {
    const list = this.props.data;
    const dataSource = this.ds.cloneWithRows(list);


    return (
      <View style={styles.container}>
      {/*
        <TouchableHighlight
          style={styles.button}
          onPress={() => this.startScan()}>
            <Text style={styles.button_text}>
              Scan Bluetooth ({this.state.scanning ? 'on' : 'off'})
            </Text>
        </TouchableHighlight>
        */}

        <ScrollView style={styles.scroll}>
          {(list.length == 0) &&
            <View style={{flex:1, margin: 20}}>
              <Text style={{textAlign: 'center'}}>No peripherals</Text>
            </View>
          }
          <ListView
            enableEmptySections={true}
            dataSource={dataSource}
            renderRow={(item) => {
              const color = item.connected ? 'green' : '#fff';
              return (
                <TouchableHighlight onPress={() => this.props.onConnect(item) }>
                  <View style={[styles.row, {backgroundColor: color}]}>
                    <Text style={{fontSize: 15, textAlign: 'center', color: '#333333', padding: 5}}>{item.name}</Text>
                    <Text style={{fontSize: 10, textAlign: 'center', color: '#333333', padding: 5}}>{item.id}</Text>
                    </View>
                </TouchableHighlight>
              );
            }}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    width: window.width,
    height: window.height,
  },
  button: {
    marginTop: 20,
    margin: 10,
    padding:10,
    backgroundColor:'#103c9d'
  },
  button_text: {
    color: '#fff',
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    margin: 10,
  },
  row: {
    margin: 10
  },
});
