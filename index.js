/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import { AppRegistry } from 'react-native';
import React from 'react';
import { Activity } from './src/components/Activity';
import { Applet } from './src/components/Applet';
import { name as appName } from './app.json';
import config from './src/config';

export default function Main() {
  return (
    // <Activity srcUrl={config.activityUrl} />
    <Applet />
  );
}

AppRegistry.registerComponent(appName, () => Main);
