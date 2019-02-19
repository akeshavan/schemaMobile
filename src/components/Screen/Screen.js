import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import jsonld from 'jsonld';
import * as Animatable from 'react-native-animatable';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { InputSelector } from '../InputSelector';

/**
 * this component renders a given screen from an activity.
 * its job is the expand the jsonld URL for a screen, and
 * animate the screen when it changes.
 * the jsonLD will specify an inputType.
 * this could be a radio, text-input, voice recording,
 * video, picture, etc..
 * the Screen component will pass this on to the InputSelector
 * who will figure out how to render the input.
 */

class Screen extends Component {
  /**
   * the props to this component are:
   * `url` : a URL to a jsonld file that describes this screen.
   * `response` : a value from the parent component if this screen has a response
   * associated with it.
   * `saveResponse` : a function that takes in a response from the child component
   * and passes it to the parent component (whose job it is to save the response
   * for this particular screen)
   */
  state = {
    /**
     * initially, when the data isn't loaded, we set the status to loading
     * when its ready, status === 'ready'
     */
    status: 'loading',
  }

  /**
   * when the component mounts, load the question
   */
  componentDidMount() {
    this.getQuestion();
  }

  /**
   * if the `url` prop changed, make sure to load it
   * and also animate the screen to show that its changed.
   */
  componentDidUpdate() {
    const { oldUrl } = this.state;
    const { url } = this.props;
    if (oldUrl !== url) {
      this.setOldUrl(url);
      this.getQuestion().then(() => {
        if (this.animatedTextRef) {
          this.animatedTextRef.startAnimation();
        }
      });
    }
  }

  /**
   * run the parent component's saveResponse method.
   * @param {*} r is a response from the child component, InputSelector.
   */
  // eslint-disable-next-line
  onResponse(r) {
    console.log('resonse at screen', r);
    const { saveResponse } = this.props;
    saveResponse(r);
  }

  /**
   * save the current URL value to keep track of when it changes
   * @param {*} url : the current URL of the component.
   */
  setOldUrl(url) {
    this.setState({ oldUrl: url });
  }

  /**
   * a method to expand a jsonld URL from the `url` prop.
   * first, it sets the component's status to 'loading'
   * then it expands the jsonld and extracts the
   * `question` property, the `inputType` property
   * and then expands the jsonld of the input's value contraints
   * and saves it to the state as `constraints`. When its done,
   * this component's `status` is set to 'ready'.
   */
  getQuestion() {
    const { url } = this.props;
    this.setState({ status: 'loading' });
    return jsonld.expand(url).then((resp) => {
      const question = resp[0]['http://schema.org/question'][0]['@value'];
      const inputType = resp[0]['https://schema.repronim.org/inputType'][0]['@value'];
      return jsonld.expand(resp[0]['https://schema.repronim.org/valueconstraints'][0]['@id'])
        .then((c) => {
          this.setState({
            question,
            inputType,
            constraints: c[0],
            status: 'ready',
          });
        });
    });
  }


  /**
   * method to render the question with
   * an animation view, so that the whole screen
   * changes when the question changes.
   * The child component here is the `InputSelector`
   * which figures out how to render the question
   * (e.g. should it render a radio, audio, etc.)
   */
  renderQuestion() {
    const {
      question,
      inputType,
      constraints,
    } = this.state;
    const { animationDirection, response } = this.props;
    return (
      <Animatable.View animation={animationDirection} ref={(ci) => { this.animatedTextRef = ci; }}>
        <InputSelector
          question={question}
          inputType={inputType}
          constraints={constraints}
          response={response}
          onResponse={r => this.onResponse(r)}
        />
      </Animatable.View>
    );
  }

  /**
   * if state.status is ready, we render the question on teh screen,
   * if not, then render an Activity Indicator (a spinny thing)
   */
  render() {
    const { status } = this.state;
    if (status === 'ready') {
      return this.renderQuestion();
    }
    return (
      <View>
        <ActivityIndicator animating color={Colors.deepPurple900} />
      </View>
    );
  }
}

// eslint-disable-next-line
export { Screen };
