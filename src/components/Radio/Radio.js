import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';
import _ from 'lodash';
import { RadioButton, Colors } from 'react-native-paper';

/**
 * This component is for the radio input UI.
 * currently, its rendered using the react-native-paper UI kit
 * but this can be changed in the future.
 * the job of this component is to parse the `valueContraints`,
 * a jsonld object, a
 * prop it recieves to determine how to render the radio options.
 * it should initialize to a selected value if the user has
 * answered this question already.
 */
class Radio extends Component {
  /**
   * the props to this component are:
   * `response`: the response value, used to render the radio with a response if
   * its been selected before.
   * `constraints` : the jsonld object that tells us which options to render.
   * It needs to be a list of
   * 'http://schema.org/name' and 'http://schema.org/value' keys.
   * `sendResponse`: a method from the parent component that will send the
   * user's response up the component tree.
   */

  /**
   * the state is initialized to be empty.
   */
  state = {

  };

  /**
   * when the component mounts, parse the `contraints` prop schema
   * to set up our radio UI.
   */
  componentDidMount() {
    this.setDataFromProps();
  }

  /**
   * set the state's `data` as the parsed radio options.
   */
  setDataFromProps() {
    const radioOptions = this.parseDataFromProps();
    this.setState({ data: radioOptions });
  }

  /**
   * this is the main method that converts the jsonld
   * schema of the `constraints` prop to a form that a
   * radio input accepts, which is a list of objects
   * with keys "label" and "value"
   */
  parseDataFromProps() {
    const { constraints } = this.props;
    const listItems = constraints['http://schema.org/itemListElement'][0]['@list'];
    const radioOptions = _.map(listItems, (c) => {
      const label = c['http://schema.org/name'][0]['@value'];
      const value = c['http://schema.org/value'][0]['@value'];
      return {
        label,
        value,
      };
    });
    return radioOptions;
  }

  /**
   * a method to render the RadioButton list.
   * @param {Array} radioOptions : a list of objects with keys "label" and "value"
   */
  // eslint-disable-next-line
  renderRadioOptions(radioOptions) {
    return _.map(radioOptions, (o) => {
      return (
        <View key={o.value} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton.Android value={o.value} color={Colors.deepPurple900} />
          <Text style={{ fontSize: 16, fontWeight: '300' }}>{o.label}</Text>
        </View>
      );
    });
  }

  /**
   * the main render method renders the radio group.
   * if there aren't any radio options (store in `state.data`)
   * then don't render anything (this happens when the jsonld for the screen)
   * hasn't quite loaded yet.
   */
  render() {
    const { response, sendResponse } = this.props;
    const { data } = this.state;

    if (data) {
      return (
        <RadioButton.Group
          onValueChange={value => sendResponse(value)}
          value={response}
        >
          {this.renderRadioOptions(data)}
        </RadioButton.Group>
      );
    }
    return (
      <View />
    );
  }
}

// eslint-disable-next-line
export { Radio };
