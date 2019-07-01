import { Permissions, Notifications } from "expo";

import React from "react";
import { Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import * as firebase from "firebase";
import "firebase/firestore";

// This refers to the function defined earlier in this guide
// import registerForPushNotificationsAsync from './registerForPushNotificationsAsync';

const PUSH_ENDPOINT = "https://your-server.com/users/push-token";

async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== "granted") {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
    console.log("finalStatus: ", finalStatus);
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== "granted") {
    return;
  }

  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();
  firebase
    .firestore()
    .collection("people")
    .doc("alice")
    .set({ token: token });

  // POST the token to your backend server from where you can retrieve it to send push notifications.
  // return fetch(PUSH_ENDPOINT, {
  //   method: "POST",
  //   headers: {
  //     Accept: "application/json",
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify({
  //     token: {
  //       value: token
  //     },
  //     user: {
  //       username: "Brent"
  //     }
  //   })
  // });
}

export default class NotificationScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon
        style={[{ color: tintColor }]}
        size={25}
        name={"ios-notifications"}
      />
    ),
    activeTintColor: "white"
  });

  state = {
    notification: {}
  };

  componentDidMount() {
    registerForPushNotificationsAsync();

    // Handle notifications that are received or selected while the app
    // is open. If the app was closed and then opened by tapping the
    // notification (rather than just tapping the app icon to open it),
    // this function will fire on the next tick after the app starts
    // with the notification data.
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }

  _handleNotification = notification => {
    this.setState({ notification: notification });
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Origin: {this.state.notification.origin}</Text>
        <Text>Data: {JSON.stringify(this.state.notification.data)}</Text>
      </View>
    );
  }
}
