import { observable, action, computed } from 'mobx';
import UUIDs from '../data_model/UUIDs';

class ServiceStore {
  // @observable uuids = new UUIDs();
  @observable uuids = null;

  constructor () {
    this.uuids = new UUIDs();
  }

  @action RemoveServiceUUIDs() {
    this.uuids.clearUUIDs();
  }

  @action AddNotifyServiceUUID(service) {
    this.uuids.notifyServiceUUID.push(service);
  }

  @action AddNotifyCharacteristicUUID(characteristic) {
    this.uuids.notifyCharacteristicUUID.push(characteristic);
  }

  @action AddReadServiceUUID(service) {
    this.uuids.readServiceUUID.push(service);
  }

  @action AddReadCharacteristicUUID(characteristic) {
    this.uuids.readCharacteristicUUID.push(characteristic);
  }

  @action AddWriteWithResponseServiceUUID(service) {
    this.uuids.writeWithResponseServiceUUID.push(service);
  }

  @action AddWriteWithResponseCharacteristicUUID(characteristic) {
    this.uuids.writeWithResponseCharacteristicUUID.push(characteristic);
  }

  @action AddWriteWithoutResponseServiceUUID(service) {
    this.uuids.writeWithoutResponseServiceUUID.push(service);
  }

  @action AddWriteWithoutResponseCharacteristicUUID(characteristic) {
    this.uuids.writeWithoutResponseCharacteristicUUID.push(characteristic);
  }

  @computed get serviceUUIDs() {
    return this.uuids;
  }

  @computed get notifyServiceUUID() {
    return this.uuids.notifyServiceUUID;
  }

  @computed get notifyCharacteristicUUID() {
    return this.uuids.notifyCharacteristicUUID;
  }

  @computed get readServiceUUID() {
    return this.uuids.readServiceUUID;
  }

  @computed get readCharacteristicUUID() {
    return this.uuids.readCharacteristicUUID;
  }

  @computed get writeWithResponseServiceUUID() {
    return this.uuids.writeWithResponseServiceUUID;
  }

  @computed get writeWithResponseCharacteristicUUID() {
    return this.uuids.writeWithResponseCharacteristicUUID;
  }

  @computed get writeWithoutResponseServiceUUID() {
    return this.uuids.writeWithoutResponseServiceUUID;
  }

  @computed get writeWithoutResponseCharacteristicUUID() {
    return this.uuids.writeWithoutResponseCharacteristicUUID;
  }
}

const serviceStore = new ServiceStore();
export default serviceStore;
