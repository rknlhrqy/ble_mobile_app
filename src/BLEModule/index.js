import {
  View,
  Platform,
  NativeModules,
  NativeAppEventEmitter,
  NativeEventEmitter
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import { stringToBytes } from 'convert-string';

import { SCAN_DURATION, MAX_BYTE_SIZE } from '../config/config';
import Log from '../utils/Log';
import UUIDs from '../data_model/UUIDs';

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default class BLEModule {

  constructor(store) {
    this.peripheralId = null;
    this.isConnecting = false;
    this.ServiceStore = store;
  }

  start = () => {
    // Init the module
    return BleManager.start({showAlert: false})
      .then(()=>{
        this.checkState();
        Log.out('Init BLE module success.');
      }).catch(error=>{
        throw new Error(error);
        Log.out('Init BLE module fail.');
      });
  };

  // Force the module to check the state of BLE and trigger a
  // BleManagerDidUpdateState event.
  checkState = () => {
    BleManager.checkState();
  }

/*
  scan = () => {
    BleManager.scan([], SCAN_DURATION, false)
      .then(() => {
        Log.out('Scan started');
      }).catch((err)=>{
        throw new Error(err);
        Log.out('Scan started fail');
      });
  };
*/

  scan = () => {
    return new Promise((resolve, reject) => {
      BleManager.scan([], SCAN_DURATION, false).then(() => {
        Log.out('Scan started');
        resolve();
      }).catch((err)=>{
        Log.out('Scan started fail');
        reject(err);
      });
    });
  };
/*
  scan = () => {
    return new Promise((resolve, reject) => {
      BleManager.scan([], SCAN_DURATION, false)
        .then(() => {
          Log.out('Scan started');
          resolve();
        }).catch((err)=>{
          Log.out('Scan started fail');
          reject(err);
        });
    });
  };
  */
  /*
  scan = async () => {
    try {
      await BleManager.scan([], SCAN_DURATION, false);
    } catch(error) {
      throw new Error(error);
    }
  };
  */

  stopScan = () => {
    BleManager.stopScan()
      .then(() => {
        Log.out('Scan stopped');
      }).catch((err)=>{
        throw new Error(err);
	      Log.out('Scan stopped fail' + err);
	    });
  };

  addListener = (eventName, func) => {
    return BleManagerEmitter.addListener(eventName, func);
  };

  connect = (id) => {
    this.isConnecting = true;
    return new Promise( (resolve, reject) =>{
      BleManager.connect(id)
        .then(() => {
          Log.out('Connected success.');
          return BleManager.retrieveServices(id);
        })
        .then((peripheralInfo)=>{
          this.peripheralId = peripheralInfo.id;
          this.retrieveUUID(peripheralInfo);
          this.isConnecting = false;
          resolve(peripheralInfo);
        })
        .catch(error=>{
          Log.out('Connected error:' + error);
          this.isConnecting = false;
          reject(error);
        });
    });
  };

/*
	write = (serviceUUID, characteristicUUID, data) => {
    const dataBytes = stringToBytes(data);
    BleManager.write(this.peripheralId, serviceUUID, characteristicUUID, dataBytes, MAX_BYTE_SIZE).then(() => {
      Log.out('Write success');
    }).catch((error) => {
      Log.out('Write failed');
      throw new Error(error);
    });
  }
  */
  write = (serviceUUID, characteristicUUID, data) => {
    const dataBytes = stringToBytes(data);
    return new Promise((resolve, reject) => {
      BleManager.write(this.peripheralId, serviceUUID, characteristicUUID, dataBytes, MAX_BYTE_SIZE).then(() => {
        Log.out('Write success');
        resolve();
      }).catch((error) => {
        Log.out('Write failed');
        reject(error);
      });
    });
  }

  writeWithoutResponse = (serviceUUID, characteristicUUID, data) => {
    const dataBytes = stringToBytes(data);
    return new Promise((resolve, reject) => {
      BleManager.writeWithoutResponse(this.peripheralId, serviceUUID, characteristicUUID, dataBytes, MAX_BYTE_SIZE).then(() => {
        Log.out('writeWithoutResponse success');
        resolve();
      }).catch((error) => {
        Log.out('writeWithoutResponse failed');
        reject(error);
      });
    });
  }
/*
  startNotification = (serviceUUID, characteristicUUID) => {
    BleManager.startNotification(this.peripheralId, serviceUUID, characteristicUUID).then(() => {
      Log.out('Start Notification success');
    }).catch((error) => {
      Log.out('Start Notification error');
      throw new Error(error);
    });
  }
*/
  startNotification = (serviceUUID, characteristicUUID) => {
    // Must return Promise. So that async/await works on this function.
    return new Promise((resolve, reject) => {
      BleManager.startNotification(this.peripheralId, serviceUUID, characteristicUUID).then(() => {
        Log.out('Start Notification success');
        resolve();
      }).catch((error) => {
        Log.out('Start Notification error');
        reject(error);
      });
    });
  }

  stopNotification = (serviceUUID, characteristicUUID) => {
    BleManager.stopNotification(this.peripheralId, serviceUUID, characteristicUUID).then(() => {
      Log.out('Stop Notification success!');
    }).catch((error) => {
      Log.out('Stop Notification error');
      throw new Error(errro);
    });
  }

  disconnect = () => {
    BleManager.disconnect(this.peripheralId)
		  .then(() => {
		    Log.out('Disconnected');
		  }).catch((error) => {
        throw new Error(error);
			  Log.out('Disconnected error:',error);
		  });
  };

  swapEndianWithColon = (str) => {
		let format = '';
		let len = str.length;
		for(let j = 2; j <= len; j = j + 2){
			format += str.substring(len-j, len-(j-2));
			if(j != len) {
				format += ":";
			}
		}
	    return format.toUpperCase();
	};

  getMacAddressFromIOS = (data) => {
    let macAddressInAdvertising = data.advertising.kCBAdvDataManufacturerMacAddress;
    if(!macAddressInAdvertising){
        return;
    }
    macAddressInAdvertising = macAddressInAdvertising.replace("<","").replace(">","").replace(" ","");
    if(macAddressInAdvertising != undefined && macAddressInAdvertising != null && macAddressInAdvertising != '') {
        macAddressInAdvertising = this.swapEndianWithColon(macAddressInAdvertising);
    }
    return macAddressInAdvertising;
  };

  fullUUID = (uuid) => {
    if (uuid.length === 4){
       return '0000' + uuid.toUpperCase() + '-0000-1000-8000-00805F9B34FB'
    }
    if (uuid.length === 8) {
       return uuid.toUpperCase() + '-0000-1000-8000-00805F9B34FB'
    }
    return uuid.toUpperCase()
  };

  retrieveUUID = (peripheralInfo) => {
    Log.out('calling retrieveUUID');
    this.ServiceStore.RemoveServiceUUIDs();
    for(let item of peripheralInfo.characteristics){
      item.service = this.fullUUID(item.service);
      item.characteristic = this.fullUUID(item.characteristic);
      if(Platform.OS == 'android'){
        if(item.properties.Notify == 'Notify'){
          this.ServiceStore.AddNotifyServiceUUID(item.service);
          this.ServiceStore.AddNotifyCharacteristicUUID(item.characteristic);
        }
        if(item.properties.Read == 'Read'){
          this.ServiceStore.AddReadServiceUUID(item.service);
          this.ServiceStore.AddReadCharacteristicUUID(item.characteristic);
        }
        if(item.properties.Write == 'Write'){
          this.ServiceStore.AddWriteWithResponseServiceUUID(item.service);
          this.ServiceStore.AddWriteWithResponseCharacteristicUUID(item.characteristic);
        }
        if(item.properties.WriteWithoutResponse == 'WriteWithoutResponse'){
          this.ServiceStore.AddWriteWithoutResponseServiceUUID(item.service);
          this.ServiceStore.AddWriteWithoutResponseCharacteristicUUID(item.chcharacteristic);
        }
      }else{  //ios
        for(let property of item.properties){
          if(property == 'Notify'){
            this.ServiceStore.AddNotifyServiceUUID(item.service);
            this.ServiceStore.AddNotifyCharacteristicUUID(item.characteristic);
          }
          if(property == 'Read'){
            this.ServiceStore.AddReadServiceUUID(item.service);
            this.ServiceStore.AddReadCharacteristicUUID(item.characteristic);
          }
          if(property == 'Write'){
            this.ServiceStore.AddWriteWithResponseServiceUUID(item.service);
            this.ServiceStore.AddWriteWithResponseCharacteristicUUID(item.characteristic);
          }
          if(property == 'WriteWithoutResponse'){
            this.ServiceStore.AddWriteWithoutResponseServiceUUID(item.service);
            this.ServiceStore.AddWriteWithoutResponseCharacteristicUUID(item.characteristic);
          }
        }
      }
    }
    /*
    Log.out('readServiceUUID: ' + this.ServiceStore.readServiceUUID);
    Log.out('readCharacteristicUUID: ' + this.ServiceStore.readCharacteristicUUID);
    Log.out('writeWithResponseServiceUUID: ' + this.ServiceStore.writeWithResponseServiceUUID);
    Log.out('writeWithResponseCharacteristicUUID: ' + this.ServiceStore.writeWithResponseCharacteristicUUID);
    Log.out('writeWithoutResponseServiceUUID: ' + this.ServiceStore.writeWithoutResponseServiceUUID);
    Log.out('writeWithoutResponseCharacteristicUUID: ' + this.ServiceStore.writeWithoutResponseCharacteristicUUID);
    Log.out('notifyServiceUUID: ' + this.ServiceStore.notifyServiceUUID);
    Log.out('notifyCharacteristicUUID: ' + this.ServiceStore.notifyCharacteristicUUID);
    */
  };

  getUUID = () => {
    return this.ServiceStore.serviceUUIDs;
  };
}
