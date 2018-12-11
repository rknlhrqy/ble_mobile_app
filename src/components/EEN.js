import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions
} from 'react-native';
import Log from '../utils/Log';

export default class EEN extends Component {
  // state = {data: [{text: '1'}, {text: '2'}, {text: '3'}]};

  renderItem = (item) => {
    Log.out('Processing item: ' + item.item.text);
    return (
       <Text style={styles.row}>{item.item.text}</Text>
    );
  }
/*
  renderData = () => {
    const str = this.props.eenParams;
    const data = [];
    if (str.length !== 0) {
      Log.out(str);
      const data_str = str.replace('{', '').replace('}', '').split(',');
      Log.out(data_str);
      data = data_str.map(each => {
        return({text: each});
      });
      Log.out(data);
      //const data = Object.keys(JSON.parse(str.replace(/&quot;/ig, '"'))).map((key) => {
        //return({text: key + ': ' + str[key]});
      //});
    }
    return data;
  };
*/
  render() {
    Log.out('EEN.js: ' + this.props.eenParams);
    return (
      <View style={styles.container}>
        <Text>EEN parameters:</Text>
        <FlatList
          style={styles.table}
          data={this.props.eenParams}
          renderItem={this.renderItem}
          keyExtractor={({item}, index) => index.toString()}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    marginTop: 1,
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  table: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  row: {
    padding: 1,
    marginBottom: 1,
    backgroundColor: 'skyblue',
  },
})
