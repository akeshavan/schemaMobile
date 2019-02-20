import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';
import { Radio } from '../Radio';

/**
 * this component is the "switch" statement for the Screen.
 * it renders the UI based on the `inputType` prop.
 * This could mean a radio, audio record, video, etc.
 */

class InputSelector extends Component {
  /**
   * the props to the component are:
   * `inputType`: a string describing the desired UI component.
   * `constraints`: an Object describing how to render the component
   * `response`: the value of the input component (if its been answered already)
   * `question`: the text to display at the top of the screen.
   * `onResponse`: a function that accepts a response from the UI component.
   * ideally it comes from the parent and the parent saves the response.
   */

  /**
   * state is initialized to empty here.
   */
  state = {

  }

  /**
   * passes the user's response in the child UI component to the parent.
   * @param {*} resp : calls the `onResponse` prop function.
   */
  sendResponse(resp) {
    const { onResponse } = this.props;
    onResponse(resp);
  }

  /**
   * if we don't know the input type, render a warning message.
   */
  renderUnknown() {
    const { inputType } = this.props;
    return (
      <View>
        <Text>
          We do not know how to render this UI component:
        </Text>
        <Text style={{ backgroundColor: 'lightyellow', padding: 10 }}>
          {inputType}
        </Text>
      </View>
    );
  }

  /**
   * if `inputType` is radio, render the radio component.
   */
  renderRadio() {
    const { constraints, init, response } = this.props;
    return (
      <Radio
        constraints={constraints}
        init={init || null}
        response={response}
        sendResponse={r => this.sendResponse(r)}
      />
    );
  }

  /**
   * a large if/else function to determing which UI component to render.
   * if `inputType` isn't defined, render the "unknown" warning message.
   */
  renderInput() {
    const { inputType } = this.props;
    if (inputType === 'radio') {
      return this.renderRadio();
    }
    return this.renderUnknown();
  }

  /**
   * the main render function: renders the question at the top of the
   * screen, and the input UI component below.
   */
  render() {
    const { question } = this.props;
    return (
      <View style={{ flex: 1, justifyContent: 'space-around' }}>
        <View style={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
        >
          <Text style={{ fontSize: 20, fontWeight: '300' }}>
            {question}
          </Text>
        </View>
        <View style={{ flex: 2, paddingTop: 20 }}>
          {this.renderInput()}
        </View>
      </View>
    );
  }
}

// eslint-disable-next-line
export { InputSelector };
