/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Log from './utils/Log';
import CMMAHeader from './components/Header';
import Dashboard from './components/Dashboard';

type Props = {};
export default class App extends Component<Props> {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <CMMAHeader />
        <Dashboard />
        <Log />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
