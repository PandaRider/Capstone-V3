import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Button,
  Alert
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ListItem } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";

import "firebase/firestore";
import Firebase from "../../../Firebase";

var db = Firebase.firestore();
var details = {};

export default class ViewBooking extends React.Component {
  static navigationOptions = {
    title: "Upcoming Booking",
    headerTintColor: "#EF7568"
  };

  state = {
    gotBooking: false
  };

  getBookingDetails() {
    var roomid = this.props.navigation.getParam("bookingid");

    db.collection("fakebookings")
      .doc(roomid)
      .get()
      .then(doc => {
        if (!doc.exists) {
          console.log("No such document!");
        } else {
          details = doc.data();
          this.setState({ gotBooking: true });
        }
      })
      .catch(err => {
        console.log("Error getting document", err);
      });
  }

  componentWillMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.getBookingDetails();
    });
  }

  render() {
    if (this.state.gotBooking) {
      return (
        <View style={styles.view}>
          <Text style={styles.h1}>
            {details.purpose} @ {details.room}
          </Text>
          <ScrollView>
            <ListItem
              key={0}
              title="Booking Reference"
              subtitle={details.id}
              leftAvatar={<Icon name={"ios-bookmark"} size={20} />}
            />
            <ListItem
              key={1}
              title="Room"
              subtitle={details.room}
              leftAvatar={<Icon name={"ios-cube"} size={20} />}
            />
            <ListItem
              key={2}
              title="Date and Time"
              subtitle={
                <Text>
                  {details.date}, {details.time}
                </Text>
              }
              leftAvatar={<Icon name={"ios-calendar"} size={20} />}
            />
            <ListItem
              key={3}
              title="Number of attendees"
              subtitle={details.attendees}
              leftAvatar={<Icon name={"ios-people"} size={20} />}
            />
            <ListItem
              key={4}
              title="Purpose of booking"
              subtitle={details.purpose}
              leftAvatar={<Icon name={"ios-clipboard"} size={20} />}
            />
            <ListItem
              key={5}
              title="Location"
              subtitle={<Text>Level {details.level}</Text>}
              leftAvatar={<Icon name={"ios-locate"} size={20} />}
            />
            <Image
              source={{ uri: details.location }}
              style={{ width: "100%", height: 200 }}
            />
          </ScrollView>
          <View style={styles.alignbtns}>
            <Button
              title="Cancel booking"
              color="#EF7568"
              onPress={() => {
                Alert.alert(
                  "Cancel Booking",
                  "Do you want to cancel the booking? The slot will be released immediately.",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel"
                    },
                    {
                      text: "Yes",
                      onPress: () => {
                        db.collection("fakebookings")
                          .doc(details.id)
                          .delete();
                        this.props.navigation.navigate("Home", {
                          bookingid: details.id
                        });
                      }
                    }
                  ],
                  { cancelable: false }
                );
              }}
            />
            <Button
              color="#EF7568"
              title="Modify booking"
              onPress={() =>
                this.props.navigation.navigate("ModifyBooking", {
                  bookingid: details.id
                })
              }
            />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.centre}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    padding: 15
  },
  centre: {
    flex: 1,
    justifyContent: "center"
  },
  h1: {
    color: "#EF7568",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 15
  },
  alignbtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10
  }
});
