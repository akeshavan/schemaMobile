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
import allActivities from './src/schemaUiActivities.json'; // './src/repronimActivities.json';

export default function Main() {
  return (
    // <Activity srcUrl={config.activityUrl} />
    <Applet allActivities={allActivities} />
  );
}

AppRegistry.registerComponent(appName, () => Main);
