import React, { Component } from 'react';

import { Header } from 'react-native-elements';
import Log from '../utils/Log';

export default class CMMAHeader extends Component {
  render () {
    Log.out('Header rendered');
    return (
      <Header
        centerComponent={{ text: 'CMMA', style: { color: '#fff'}}}
      />
    );
  }
}
