import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableHighlight,
  StyleSheet,
  FlatList
} from 'react-native';

import Log from '../utils/Log';

export default class BLEModuleList extends Component {

  renderRow = ({item}) => {
    const color = item.connected ? 'green' : '#fff';
    return (
      <TouchableHighlight onPress={() => this.props.onConnect(item) }>
        <View style={[styles.row, {backgroundColor: color}]}>
          <Text style={{fontSize: 15, textAlign: 'center', color: '#333333', padding: 5}}>{item.name}</Text>
          <Text style={{fontSize: 10, textAlign: 'center', color: '#333333', padding: 5}}>{item.id}</Text>
          </View>
      </TouchableHighlight>
    );
  };

  render() {
    const list = this.props.data;

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scroll}>
          {(list.length == 0) &&
            <View style={{flex:1, margin: 20}}>
              <Text style={{textAlign: 'center'}}>No peripherals</Text>
            </View>
          }
          <FlatList
            style={styles.table}
            data={list}
            renderItem={this.renderRow}
            keyExtractor={(item, index) => index.toString()}
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
  table: {
    width: window.width,
    height: window.height,
  },
  row: {
    margin: 10
  },
});
