import React from 'react';
import { Component } from 'react';

import {
  Text,
  FlatList,
  StyleSheet
} from 'react-native';

export default class Log extends Component {
  static logStr = [
    {text: 'Log starts'},
  ];

  static out(str) {
    const log = {
      text: str,
    }
    Log.logStr.push(log);
  }

  renderItem = (item) => {
    return (
       <Text style={styles.row}>log: {item.item.text}</Text>
    );
  }

  render() {
    return (
      <FlatList
        style={styles.container}
        data={Log.logStr}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }
}
const styles = StyleSheet.create({
  container: {
    marginTop: 1,
    flex: 1,
  },
  row: {
    padding: 1,
    marginBottom: 1,
    backgroundColor: 'skyblue',
  },
})
