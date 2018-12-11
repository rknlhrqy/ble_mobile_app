// Scan duration in seconds
export const SCAN_DURATION = 5;
export const WebPage = Object.freeze({
  NoPage: 0,
  BleModuleList: 1,
  ECUInit: 2,
  EEN: 3,
});
export const ECUInitServiceUUID = '00000001-1111-2222-3333-456789ABCDEF';
export const ECUInitCharacteristicUUID = '00000002-1111-2222-3333-456789ABCDEF';
export const ECUStatusCharacteristicUUID = '00000003-1111-2222-3333-456789ABCDEF';

export const EENServiceUUID = '00001001-1111-2222-3333-456789ABCDEF';
export const EENGetParametersCharacteristicUUID = '00001002-1111-2222-3333-456789ABCDEF';
export const EENParametersCharacteristicUUID = '00001003-1111-2222-3333-456789ABCDEF';

export const MAX_BYTE_SIZE = 512;
