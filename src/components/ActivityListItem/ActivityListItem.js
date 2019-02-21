import React, { Component } from 'react';
import { View, Text } from 'react-native';
import jsonld from 'jsonld';
import { List, Colors } from 'react-native-paper';

/**
 * this components role is to show the activity name & description
 * for an activity shown in an Applet. It needs to load this information
 * from the supplied jsonld url, the `url` prop.
 */

class ActivityListItem extends Component {
  /**
   * initialize the app's state.
   */
  state = {

  }

  /**
   * when the component mounts, load the jsonld from
   * the `url` prop and extract the title and description
   * of the activity.
   */
  componentDidMount() {
    const { url } = this.props;
    const color = this.getRandomColor();
    jsonld.expand(url).then((resp) => {
      console.log('response', resp);
      const description = resp[0]['http://schema.org/description'][0]['@value'];
      const title = resp[0]['http://www.w3.org/2004/02/skos/core#prefLabel'][0]['@value'];
      this.setState({ description, title, color });
    });
  }

  /**
   * **getRandomColor** is a method that returns a random color
   * from the material UI kit we're using. This is just for
   * decoration and hopefully the jsonld object will have a link
   * to an icon/image of some sort.
   */
  // eslint-disable-next-line
  getRandomColor() {
    const allColors = Object.keys(Colors);
    const random = Math.floor(Math.random() * (allColors.length));
    return Colors[allColors[random]];
  }

  /**
   * **renderLeftIcon** renders a circle with the title's first
   * letter in it. This is to distinguish the activities but
   * we could have this be an image/icon from the jsonld file.
   */
  renderLeftIcon() {
    const { title, color } = this.state;

    if (title) {
      return (
        <View style={{
          width: 50,
          height: 50,
          borderRadius: 50,
          borderWidth: 4,
          borderColor: color,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
          <Text style={{ fontSize: 20 }}>
            {title[0]}
          </Text>
        </View>
      );
    }
    return (
      <View />
    );
  }

  /**
   * the main render method returns a List.Item from the
   * react-native-paper UI kit. If the title and description
   * aren't set yet, we write 'loading' ... in its place.
   */
  render() {
    const { description, title } = this.state;
    return (
      <List.Item
        title={title || 'loading'}
        description={description || '...'}
        left={() => this.renderLeftIcon()}
      />
    );
  }
}

// eslint-disable-next-line
export { ActivityListItem };
