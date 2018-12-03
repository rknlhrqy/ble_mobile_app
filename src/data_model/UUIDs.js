export default class UUIDs {

  constructor() {
    this.readServiceUUID = new Array();
    this.readCharacteristicUUID = new Array();
    this.writeWithResponseServiceUUID = new Array();
    this.writeWithResponseCharacteristicUUID = new Array();
    this.writeWithoutResponseServiceUUID = new Array();
    this.writeWithoutResponseCharacteristicUUID = new Array();
    this.notifyServiceUUID = new Array();
    this.notifyCharacteristicUUID = new Array();
  }

  clearArray(a) {
    while(a.length > 0) {
      a.pop();
    }
  }

  clearUUIDs() {
    this.clearArray(this.readServiceUUID);
    this.clearArray(this.readCharacteristicUUID);
    this.clearArray(this.writeWithResponseServiceUUID);
    this.clearArray(this.writeWithResponseCharacteristicUUID);
    this.clearArray(this.writeWithoutResponseServiceUUID);
    this.clearArray(this.writeWithoutResponseCharacteristicUUID);
    this.clearArray(this.notifyServiceUUID);
    this.clearArray(this.notifyCharacteristicUUID);
  }
}
