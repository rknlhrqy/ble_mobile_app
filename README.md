# ble_mobile_app
Mobile app connecting to any remote Bluetooth Low Energy device<br>
<br>
# detail
This mobile app is developed using React Native. It can run in both iphone and android phone.<br>
This mobile app uses NPM module react-native-ble-manager to communicate with a remove system via Bluetooth Low Energy (BLE). For now it is tested by conning with a Raspberry Pi device and a Linux laptop via BLE.<br>
The GATT application is developed using Gobbledegook software which can be found at https://github.com/nettlep/gobbledegook <br>
Download/build/run Gobbledegook in the Raspberry Pi device or the Linux laptop with has BLE module.<br>
It uses MobX to store BLE Service/Characteristics UUIDs.<br>
