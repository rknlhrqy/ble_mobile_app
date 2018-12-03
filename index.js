/** @format */
import React from 'react';
import {AppRegistry} from 'react-native';
import { Provider } from 'mobx-react';

import ServiceStore from './src/store/ServiceStore';

import App from './src/App';
import {name as appName} from './app.json';

const app = () => (
  <Provider ServiceStore={ServiceStore}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => app);
