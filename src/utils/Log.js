import React from 'react';
import { Component } from 'react';

import {
  View,
  Text,
  ScrollView,
  ListView
} from 'react-native';

// Log.logStr = new Array();
// Log.logStr = [];
export default class Log extends Component {
  static logStr = [];
  /*
  state = {
    logs: null,
  };
  */

  constructor(props) {
    super(props);
    // this.state.logs = Log.logStr;
    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2});
  }

  static out(str) {
    Log.logStr.push(str);
    //this.setState({logs: Log.logStr});
  }
  render() {
    //const list: any[] = Array.from(this.state.logs);
    //const list = Array.from(Log.logStr);
    //const dataSource = this.ds.cloneWithRows(list);
    const dataSource = this.ds.cloneWithRows(Log.logStr);

    return (
      <View>
        <ScrollView>
          <ListView
            enableEmptySections={true}
            dataSource={dataSource}
            renderRow={(item) => {
              return (
                <View>
                  <Text style={{backgroundColor: '#dbdbd9'}}>log: {item}</Text>
                </View>
              );
            }}
          />
        </ScrollView>
      </View>
    );
  }
}
