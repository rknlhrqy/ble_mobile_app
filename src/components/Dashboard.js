import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  ListView,
  ScrollView,
  Platform
} from 'react-native';
import { inject, observer } from 'mobx-react';
import { bytesToString } from 'convert-string';

import { WebPage } from '../config/config';
import Log from '../utils/Log';

import BLEModule from '../BLEModule';
import UUIDs from '../data_model/UUIDs';
import ECUInit from './ECUInit';
import BLEModuleList from './BLEModuleList';

@inject(['ServiceStore'])
@observer
export default class Dashboard extends Component implements UUIDsInterface {

  BleModule = new BLEModule(this.props.ServiceStore);
  state = {
    scanning: false,
    peripherals: new Map(),
    connectedDevice: null,
    page: WebPage.BleModuleList,
    ecuStatus: false,
  };

  constructor(props) {
    super(props);
    debugger;
    this.setState.scanning = false;

    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2});

    this.startScan = async () => {
      Log.out('BleManagerStartScan');
      if (!this.state.scanning) {
        try {
          this.setState({scanning: true});
          await this.BleModule.scan();
        } catch (error) {
          throw new Error(error);
        }
      }
    };

    this.handleUpdateState = (args) => {
      Log.out('BleManagerDidUpdateState:' + args);
      this.BleModule.bluetoothState = args.state;
      // When BLE is enabled, it starts the search automatically.
      if(args.state == 'on'){
        this.startScan();
      }
    };

    this.handleStopScan = () => {
        Log.out('BleManagerStopScan: Scanning is stopped');
        this.setState({scaning: false});
    };

    this.handleDiscoverPeripheral = (peripheral) => {
        Log.out('Discover ' + peripheral.id + ' ' + peripheral.name);
        let id;  //BLE Peripheral id
        let macAddress;  //BLE MAC macAddress
        if(Platform.OS == 'android'){
            macAddress = peripheral.id;
            id = macAddress;
        } else {
            // MAC address is not needed when connecting to a Ble
            // device. However when doing cross-platform paring, it is
            // required.
            // If advertising with MAC address, ios can get the MAC
            // address via advertizing broadcasting 0x18.
            macAddress = this.BleModule.getMacAddressFromIOS(peripheral);
            id = peripheral.id;
        }
        let peripherals = this.state.peripherals;
        peripherals.set(peripheral.id, peripheral);
        this.setState({peripherals});
    };

    this.handleConnectPeripheral = (args) => {
        Log.out('BleManagerConnectPeripheral:' + args);
    };

    this.handleDisconnectPeripheral = (args) => {
        console.log('BleManagerDisconnectPeripheral:', args);
    };

    this.handleUpdateValue = ({ value, peripheral, characteristic, service }) => {
        // console.log('BluetoothUpdateValue', value);
        const str = bytesToString(value);
        Log.out('BluetoothUpdateValue: ' + characteristic + ' ' + str);
        this.setState({ecuStatus: str});
    };
  }

  async componentWillMount() {
    try {
      await this.BleModule.start();

      this.updateStateListener = this.BleModule.addListener('BleManagerDidUpdateState', this.handleUpdateState);
      this.stopScanListener = this.BleModule.addListener('BleManagerStopScan', this.handleStopScan);
      this.discoverPeripheralListener = this.BleModule.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
      this.connectPeripheralListener = this.BleModule.addListener('BleManagerConnectPeripheral', this.handleConnectPeripheral);
      this.disconnectPeripheralListener = this.BleModule.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectPeripheral);
      /*
      this.updateValueListener = this.BleModule.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValue);
      */
    }catch(error){
      throw new Error(error);
    }
  }
/*
  componentDidMount() {
    this.BleModule.scan().then(()=>{
        this.setState({ scaning:true });
      }).catch(err=>{
        throw new Error(err);
      });
  }
  */
  async componentDidMount() {
    try {
      this.setState({ scaning:true });
      await this.BleModule.scan();
    } catch(err) {
      throw new Error(err);
    }
  }

  componentWillUnmount() {
    this.updateStateListener.remove();
    this.stopScanListener.remove();
    this.discoverPeripheralListener.remove();
    this.connectPeripheralListener.remove();
    this.disconnectPeripheralListener.remove();
    this.updateValueListener.remove();
    if(this.state.isConnected){
      this.BleModule.disconnect();
    }
  }

  connect = async (peripheral) => {
    // Log.out('Connect to Peripheral: ' + peripheral.name);
    try {
      await this.BleModule.stopScan();
      this.setState({
        scanning: false,
      });
      const peripheralInfo = await this.BleModule.connect(peripheral.id);
      this.setState({
        connectedDevice: peripheralInfo.id,
        page: WebPage.ECUInit,
      });
    } catch (error) {
      throw new Error(error);
    }
  };


	/**
     * 写数据到蓝牙
     * 参数：(peripheralId, serviceUUID, characteristicUUID, data, maxByteSize)
     * Write with response to the specified characteristic, you need to call retrieveServices method before.
     * */
	writeAndEnableNotify = async (serviceUUID, writeCharacteristicUUID, notifyCharacteristicUUID, data) => {
    try {
      await this.BleModule.startNotification(serviceUUID, notifyCharacteristicUUID);
      this.updateValueListener = await this.BleModule.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValue);
      await this.BleModule.write(serviceUUID, writeCharacteristicUUID, data);
      Log.out('Write success: ' + data.toString());
    } catch (error) {
      Log.out('Write failed: ' + data);
      throw new Error(error);
    }
  }

  startNotification = async (serviceUUID, characteristicUUID) => {
    try {
      await this.BleModule.startNotification(serviceUUID, characteristicUUID);
      Log.out('Start Notification success');
    } catch (error) {
      Log.out('Start Notification failed');
      throw new Error(error);
    }
  }

  stopNotification = async (serviceUUID, characteristicUUID) => {
    try {
      await this.BleModule.stopNotification(serviceUUID, characteristicUUID);
      // Log.out('Stop Notification success');
    } catch (error) {
      // Log.out('Stop Notification failed');
      throw new Error(error);
    }
  }

  renderPage = (list) => {
    Log.out('this.state.page: ' + this.state.page);
    /*
    switch(this.state.page) {
      case WebPage.BLEModuleList:
        Log.out('get BleModuleList');
        return (<BLEModuleList onConnect={this.onConnect} />);
      case WebPage.ECUInit:
        Log.out('get ECUInit');
        return (<ECUInit />);
      case WebPage.EEN:
        Log.out('get EEN');
        return (<EEN />);
      default:
        Log.out('get Null');
        return null;
    }
    */
    if (this.state.page === WebPage.BleModuleList) {
      Log.out('get BleModuleList');
      return (<BLEModuleList data={list} onConnect={this.connect} />);
    } else if (this.state.page === WebPage.ECUInit) {
      Log.out('get ECUInit');
      return (
        <View>
        <ECUInit onSubmit={this.writeAndEnableNotify} ecuStatus={this.state.ecuStatus}/>
        <View><Text>ECU status: {this.state.ecuStatus}!</Text></View>
        </View>
      );
    } else if (this.state.page === WebPage.EEN) {
      Log.out('get EEN');
      return (<EEN />);
    } else {
      Log.out('get Null');
      return null;
    }
  };

  render() {
    const list = Array.from(this.state.peripherals.values());
    return this.renderPage(list);
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
