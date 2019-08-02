import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ListItem } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";

import "firebase/firestore";
import Firebase from "../../../Firebase";

var db = Firebase.firestore();

export default class AvailableRooms extends React.Component {
  static navigationOptions = {
    title: "Select Room",
    headerTintColor: "#EF7568"
  };

  state = {
    availableList: []
  };

  getAvailableRooms() {
    db.collection("fakerooms")
      .orderBy("room")
      .get()
      .then(snapshot => {
        const items = [];
        snapshot.forEach(doc => {
          items.push(doc.data());
        });
        this.setState({
          availableList: items
        });
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
  }

  getAvailableRoomsItem() {
    return this.state.availableList.map((l, i) => (
      <ListItem
        key={i}
        // leftAvatar={{ source: require("../../assets/stlounge.jpg") }}
        leftAvatar={{ source: { uri: l.image } }}
        title={l.room}
        subtitle={
          <Text>
            Level {l.level}, Capacity of {l.capacity}
          </Text>
        }
        containerStyle={styles.availableroomitem}
        chevron={true}
        onPress={() =>
          this.props.navigation.navigate("AddBooking", {
            roomid: l.id,
            date: this.props.navigation.getParam("date"),
            start: this.props.navigation.getParam("start"),
            end: this.props.navigation.getParam("end")
          })
        }
      />
    ));
  }

  componentWillMount() {
    this.getAvailableRooms();
  }

  render() {
    return (
      <View>
        <Text style={styles.h1}>Available Rooms</Text>
        <Text style={styles.h2}>
          Date: {this.props.navigation.getParam("date")}
        </Text>
        <Text style={styles.h2}>
          Duration:{" "}
          {this.props.navigation.getParam("start") +
            ":00 - " +
            this.props.navigation.getParam("end") +
            ":00"}
        </Text>
        <ScrollView>{this.getAvailableRoomsItem()}</ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  availableroomitem: {
    borderBottomColor: "#eeeeee",
    borderBottomWidth: 1
  },
  h1: {
    color: "#EF7568",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 15
  },
  h2: {
    color: "#EF7568",
    fontSize: 16,
    textAlign: "center"
  }
});
