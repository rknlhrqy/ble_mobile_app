import React, { Component } from 'react';

import { Header } from 'react-native-elements';

export default class CMMAHeader extends Component {
  render () {
    return (
      <Header
        centerComponent={{ text: 'CMMA', style: { color: '#fff'}}}
      />
    );
  }
}
