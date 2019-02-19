/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import { AppRegistry } from 'react-native';
import React from 'react';
import { Activity } from './src/components/Activity';
import { name as appName } from './app.json';

export default function Main() {
  return (
    <Activity />
  );
}

AppRegistry.registerComponent(appName, () => Main);
