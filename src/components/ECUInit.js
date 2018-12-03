import _ from 'lodash';
import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet,
  Platform
} from 'react-native';

import { inject, observer } from 'mobx-react';

import {
  ECUInitServiceUUID,
  ECUInitCharacteristicUUID,
  ECNStatusCharacteristicUUID
} from '../config/config';

import Log from '../utils/Log';

@inject('ServiceStore')
@observer
export default class ECUInit extends Component {
  state = {
    sn: 'ESN123',
    mn: 'EMN1122',
    pn: 'EPN333333',
    ecn: false,
  };

  constructor(props) {
    super(props);
  }

  submit = () => {
    Log.out('Submit is called');
    const data = _.pick(this.state, ['sn', 'mn', 'pn']);
    const data_str = JSON.stringify(data);
    Log.out('Write:' + data_str);
    const indexService = this.props.ServiceStore.writeWithResponseServiceUUID.indexOf(ECUInitServiceUUID);
    const indexCharacteristic = this.props.ServiceStore.writeWithResponseCharacteristicUUID.indexOf(ECUInitCharacteristicUUID);

    if (indexService !== -1 && indexCharacteristic !== -1) {
      Log.out('Send to EEN');
      this.props.onSubmit(ECUInitServiceUUID, ECUInitCharacteristicUUID, data_str);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Engine Serial Number:</Text>
        <TextInput
          onChangeText={(sn) => this.setState({sn})}
          value={this.state.sn}
        />
        <Text>Engine Model Number:</Text>
        <TextInput
          onChangeText={(mn) => this.setState({mn})}
          value={this.state.mn}
        />
        <Text>Engine Part Number:</Text>
        <TextInput
          onChangeText={(pn) => this.setState({pn})}
          value={this.state.pn}
        />
        <TouchableHighlight onPress={() => this.submit()}>
          <View style={[styles.row, {backgroundColor: '#758be8'}]}>
            <Text style={{fontSize: 15, textAlign: 'center', color: '#fff', padding: 15, marginTop: 5}}>Submit</Text>
          </View>
        </TouchableHighlight>
        <Text>ECN Started?{this.state.ecn}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white',
        marginTop:Platform.OS == 'ios'?20:0,
    },
    item:{
        flexDirection:'column',
        borderColor:'rgb(235,235,235)',
        borderStyle:'solid',
        borderBottomWidth:StyleSheet.hairlineWidth,
        paddingLeft:10,
        paddingVertical:8,
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
    buttonView:{
        height:30,
        backgroundColor:'rgb(33, 150, 243)',
        paddingHorizontal:10,
        borderRadius:5,
        justifyContent:"center",
        alignItems:'center',
        alignItems:'flex-start',
        marginTop:10
    },
    buttonText:{
        color:"white",
        fontSize:12,
    },
    content:{
        marginTop:5,
        marginBottom:15,
    },
    textInput:{
    		paddingLeft:5,
    		paddingRight:5,
    		backgroundColor:'white',
    		height:50,
        fontSize:16,
        flex:1,
	},
})
