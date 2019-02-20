import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import { List, Appbar, DefaultTheme } from 'react-native-paper';
import { Activity } from '../Activity';


/**
 * This is the component for a given applet, which consists of activities
 * It will show a list view of all the activities for this applet.
 * when you click on an activity in the list, a modal will pop up
 * and show the Activity component.
 *
 * This file contains both the listview and the modal container
 */

/**
 * for now, load activities from a list of URLs in a json file.
 * eventually, this should become a jsonld file for an activitiy set
 * (aka applet)
 */
import allActivities from '../../repronimActivities.json';

/**
 * here are some styles for the modal that will show an activity
 */
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 100,
  },
  modal: {
    flex: 1,
    alignItems: 'flex-end',
    backgroundColor: '#f0f0f0',
    paddingTop: 50,
    paddingRight: 10,
  },
  main: {
    flex: 10,
  },
  text: {
    color: 'gray',
    marginTop: 10,
    fontSize: 20,
  },
});

/**
 * This is the activity modal. Its props are:
 * `modalVisible`: whether or not the modal is open
 * `toggleModal`: a method from the parent component to set visibility
 * `url` : the jsonld url for the activity
 */

class ActivityModal extends Component {
  /**
   * here we render a header with an "x" to close the modal
   * at the top (with the X at the top right)
   * and show an activity with our `url` prop mapped to
   * Activity component's `srcUrl` prop.
   */
  render() {
    const { modalVisible, toggleModal, url } = this.props;
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => { console.log('Modal has been closed.'); }}
        >
          <View style={styles.modal}>
            <TouchableOpacity onPress={() => {
              toggleModal();
            }}
            >
              <Text style={styles.text}>X</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.main}>
            <Activity srcUrl={url} />
          </View>
        </Modal>

      </View>
    );
  }
}

/**
 * This is the main Applet component.
 * Currently, it takes no props but eventually
 * it should take an jsonld url as a prop and load that.
 */
// eslint-disable-next-line
class Applet extends Component {

  /**
   * here the state variables are whether or not the modal is visible
   * and the url of the activity that's been selected
   */
  state = {
    modalVisible: false,
    url: null,
  }

  /**
   * a method to toggle the activity modal
   * @param {Boolean} visible : whether or not to show the modal
   * @param {String} url : set the modal's url prop
   */
  toggleModal(visible, url) {
    this.setState({ modalVisible: visible, url });
  }

  /**
   * a method that renders a single item in the list.
   * TODO: render the activity name and description correctly.
   * @param {String} item : a url to a jsonld file.
   */
  // eslint-disable-next-line
  renderListItem(item) {
    return (
      <TouchableOpacity key={item} onPress={() => this.toggleModal(true, item)}>
        <List.Item
          title="Activity Name"
          description={item}
        />
      </TouchableOpacity>
    );
  }

  /**
   * the main render method renders a modal that is initially hidden
   * and a flatlist of all the activities in the applet.
   */
  render() {
    const { modalVisible, url } = this.state;
    return (
      <View style={{ backgroundColor: '#f0f0f0', flex: 1 }}>
        <Appbar.Header style={{ backgroundColor: DefaultTheme.colors.background }}>
          <Appbar.Content
            title="CMI Applet"
            subtitle="Your activities"
          />
        </Appbar.Header>
        <ActivityModal
          modalVisible={modalVisible}
          toggleModal={() => this.toggleModal(0)}
          url={url}
        />
        <FlatList
          data={allActivities}
          style={{ backgroundColor: 'white' }}
          renderItem={({ item }) => this.renderListItem(item)}
        />
      </View>
    );
  }
}

// eslint-disable-next-line
export { Applet };
