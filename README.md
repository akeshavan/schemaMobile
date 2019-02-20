# schemaMobile

This repo, schemaMobile, is a sandbox to develop various UI components for the Mindlogger project.

## how to contribute a new Widget

### setup

First, get started with your development environment.
You should have `react-native` and `npm` installed.

```bash

git clone https://github.com/akeshavan/schemaMobile
cd schemaMobile
npm install
react-native run-ios
```

you should see the iOS simulator start up and load an activity:

![activityios](./docs/images/activitiesDemi.gif)

The components that make up the example above are:

* Activity
* Screen
* InputSelector
* Radio

The **Activity** component loads a set of **Screens**, which then display a widget, like a **Radio** input.
Since Mindlogger has a variety of widgets, like Audio recording, image capture, drawing, etc, we need to
render Widget's depending on how our schema describes them. The **InputSelector** componet chooses which
widget to display based on the schema. You can explore the widgets we have on https://bitsrc.io/akeshavan/mindlogger,
where you can import them with `npm` on other react-native projects.

You'll notice that the only widget we have is the **Radio** component. How do you add a new component?

#### Step 0: Prepare your schema

Prepare a jsonld schema file that describes the various screens of an activity. Check out some examples at:

https://github.com/ReproNim/schema-standardization/tree/master/activities

You should copy/paste the raw github link to the `_schema.jsonld` file in one of those folders.

Once you have the link, copy/paste it into the `src/config.js` file in the `activityURL` key.

#### Step 1: Create a new folder

Create a new folder in the `src` directory. That follows this pattern:

```bash
src/components/
├── Activity
│   ├── Activity.js
│   ├── README.md
│   └── index.js
├── InputSelector
│   ├── InputSelector.js
│   ├── README.md
│   └── index.js
├── Radio
│   ├── Radio.js
│   └── index.js
└── Screen
    ├── README.md
    ├── Screen.js
    └── index.js
```

it should have a folder with a README.md file, an index.js file, and a js file that is the same name as the folder.

Lets say you want to add a widget called `newWidget`. Your folders in the `src/components` folder would look like:

```bash
src/components/
└── newWidget
    ├── README.md
    ├── newWidget.js
    └── index.js
```

#### Step 2: Create the README and index.js files


The README.md file of course contains documentation for the widget. The index.js file should only have:

```javascript
export * from './newWidget';
```

#### Step 3: Create the new widget

the `newWidget.js` file should export a named react component. Take a look at the template below and modify:

```javascript

import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

class newWidget extends Component {
  /**
   * the props to this component are:
   * `response`: the response value, used to render the UI with an initialized value
   * `constraints` : the jsonld object that tells us how to render this widget.
   * `sendResponse`: a method from the parent component that will send the
   * user's response up the component tree.
   */

  /**
   * initialize the state of your component
   */
  state = {

  };

  /**
  * your render code goes here
  */
  render() {
    const { response } = this.props;
    return (
      <View>
        <Text>
          {repsonse}
        </Text>
      </View>
    )
  }
}

// this part is really important
export { newWidget };

```

#### Step 4: Wire it up


Next, we need to wire this widget up to the InputSelector, so it knows to map the Screen's `inputType` to your `newWidget`.

in `src/InputSelector/InputSelector.js`, in the `renderInput` method, import your widget:

```javascript

import { newWidget } from '../newWidget';

```

Then create a render method for it where you pass down the appropriate props:

```javascript
  /**
   * if `inputType` is radio, render the radio component.
   */
  renderNewWidget() {
    const { constraints, init, response } = this.props;
    return (
      <newWidget
        constraints={constraints}
        init={init || null}
        response={response}
        sendResponse={r => this.sendResponse(r)}
      />
    );
  }
```

Then, hook it up to the `renderInput` method which decides with widget is placed on the screen:

```javascript
  renderInput() {
    const { inputType } = this.props;
    if (inputType === 'radio') {
      return this.renderRadio();
    }
    // add an if statement that maps to your widget!!
    if (inputType === 'newWidget') {
      return this.renderNewWidget();
    }
    return this.renderUnknown();
  }
```

#### Step 6: Send a Pull Request!

Test out your app, and send a pull request when your new component is good to go! We'll use [bit](https://bitsrc.io/)
to build your new component so it can be installed via `npm` in the **mindlogger-app**. Thanks!!