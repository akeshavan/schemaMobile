import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Button, ProgressBar } from 'react-native-paper';
import jsonld from 'jsonld';
import _ from 'lodash';
import { Screen } from '../Screen';


/**
 * The role of this component is to:
 * load a jsonld of an _activity_ and render
 * its various screens, such that each screen is animated when it changes.
 * it is also in change of _navigation_ and showing a progress bar.
 */

class Activity extends Component {
  state = {
    /**
     * the current screen we are on. initialized to the first.
     */
    index: 0,
    /**
     * the list of screens we will render.
     */
    items: [],
    /**
     * an object to hold our responses. The keys will be the
     * jsonld URLs to the screen.
     */
    responses: {},
    /**
     * when we animate between screens, we need to set the animation
     * direction. 'fadeInUp' animation happens with we go to the next question
     * and 'fadeInDown' happens when we go to a previous question.
     */
    animationDirection: 'fadeInUp',
    /**
     * status of the app. status is 'loading' if the activity hasn't been fetched yet
     * and status is 'ready' if the data is fetched.
     */
    status: 'loading',
  }

  /**
   * before the component mounts, grab the data from the activities.
   */
  componentWillMount() {
    this.getActivities();
  }

  /**
   * this is a method that expands a jsonlod URL and sets
   * state.items
   */
  getActivities() {
    const { srcUrl } = this.props;
    this.setState({ status: 'loading' });
    jsonld.expand(srcUrl).then((resp) => {
      // this.setState({ activity: resp[0] });
      const preamble = resp[0]['http://schema.repronim.org/preamble'][0]['@value'];
      const items = _.map(resp[0]['https://schema.repronim.org/order'][0]['@list'],
        i => i['@id']);
      this.setState({ items, status: 'ready', preamble });
    });
  }

  /**
   * method to increment the index
   */
  goNext() {
    const { index } = this.state;
    this.setState({ index: index + 1, animationDirection: 'fadeInUp' });
  }

  /**
   * method to decrement the index
   */
  goBack() {
    const { index } = this.state;
    this.setState({ index: index - 1, animationDirection: 'fadeInDown' });
  }

  /**
   * method to save the response from a screen to the state.responses object.
   * @param {Any} r : r is the response of the screen. Can be any datatype.
   */
  saveResponse(r) {
    const { index, items, responses } = this.state;
    const newResponses = { ...responses, [items[index]]: r };
    this.setState({
      // eslint-disable-next-line
      responses: newResponses,
    });
  }

  /**
   * renders the back button the the left-side of the View.
   * when pressed, the button runs the goBack method of this component.
   */
  renderBackButton() {
    return (
      <View style={{ alignItems: 'flex-start' }}>
        <Button title="Back" onPress={() => { this.goBack(); }}> Back </Button>
      </View>
    );
  }

  /**
   * renders the Next button on the right-side of the View
   * when pressed, the button runs the goNext method of this component.
   */
  renderNextButton() {
    return (
      <View style={{ alignItems: 'flex-end' }}>
        <Button title="Next" onPress={() => { this.goNext(); }} mode="contained">Next</Button>
      </View>
    );
  }

  /**
   * Depending on our state.index, render only the back button
   * (if we are on the last screen) or only the next button (if we are on the first screen)
   * or both (if we are somewhere in the middle).
   */
  renderNavButtons() {
    const { index, items } = this.state;
    if (!index) {
      return (
        <View>
          {this.renderNextButton()}
        </View>
      );
    }
    if (index === items.length - 1) {
      return (
        <View>
          {this.renderBackButton()}
        </View>
      );
    }
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <View style={{ flex: 1 }}>
          {this.renderBackButton()}
        </View>
        <View style={{ flex: 1 }}>
          {this.renderNextButton()}
        </View>
      </View>
    );
  }

  /**
   * render the progress bar.
   * progress is calculated as the state.index / (state.items.length - 1)
   * to show where you are in the activity.
   */
  renderProgressBar() {
    const { index, items } = this.state;
    const progress = index / (items.length - 1);
    return (
      <ProgressBar progress={progress} style={{ paddingBottom: 0, paddingVertical: 0 }} />
    );
  }

  /**
   * render the activity.
   * in this method, we render the Screen, the progress bar, and the navigation buttons.
   */
  renderMain() {
    const {
      items,
      index,
      animationDirection,
      responses,
      preamble,
    } = this.state;
    return (
      <View style={{
        backgroundColor: 'white', flex: 1,
      }}
      >
        <View style={{ flex: 1, padding: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: '300' }}>{preamble}</Text>
        </View>
        <View style={{
          flex: 8,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
          paddingLeft: 20,
          paddingRight: 20,
        }}
        >
          <Screen
            url={items[index]}
            animationDirection={animationDirection}
            saveResponse={r => this.saveResponse(r)}
            response={responses[items[index]]}
          />
        </View>

        {this.renderProgressBar()}
        <View style={{
          flex: 1,
          backgroundColor: '#f6f6f6',
          justifyContent: 'center',
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 10,
          paddingBottom: 10,
        }}
        >
          {this.renderNavButtons()}
        </View>
      </View>
    );
  }

  /**
   * render the loading screen
   */
  // eslint-disable-next-line
  renderLoading() {
    return (
      <View style={{
        backgroundColor: 'white', flex: 1, justifyContent: 'center', alignItems: 'center',
      }}
      >
        <Text>Loading...</Text>
      </View>
    );
  }

  /**
   * the main render function renders the loading screen if the status is loading
   * or the main screen if the status is ready
   */
  render() {
    const {
      status,
    } = this.state;
    if (status === 'ready') {
      return this.renderMain();
    }
    return this.renderLoading();
  }
}

// eslint-disable-next-line
export { Activity };
