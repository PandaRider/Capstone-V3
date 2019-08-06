import React, { Component } from "react";
import { Button, Text, View, StyleSheet, Alert } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import SearchableDropdown from "react-native-searchable-dropdown";

import "firebase/firestore";
import Firebase from "../../../Firebase";

var db = Firebase.firestore();

var titles = [
  { id: 1, name: "Missing Cable" },
  { id: 2, name: "Missing Chairs" },
  { id: 3, name: "Faulty Projector" },
  { id: 4, name: "Faulty Smart TV" }
];

var descriptions = [
  { id: 1, name: "Item(s) found missing upon entering room." },
  { id: 2, name: "Item(s) found faulty upon entering room." },
  { id: 3, name: "Item(s) found faulty while using room." }
];

export default class ReportScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon style={[{ color: tintColor }]} size={25} name={"ios-alert"} />
    ),
    activeTintColor: "white"
  };

  state = {
    room: "",
    title: "",
    description: "",
    fieldsFilled: true
  };

  sendReport() {
    db.collection("reports")
      .add({
        room: this.state.room,
        title: this.state.title,
        description: this.state.description
      })
      .then(ref => {
        this.setState({
          room: "",
          fieldsFilled: true
        });
      });
  }

  render() {
    return (
      <View style={styles.view}>
        <Text style={styles.h1}>Report</Text>

        <Text style={styles.h2}>Affected Room</Text>
        <TextInput
          style={styles.input}
          placeholder={"Enter affected room"}
          value={this.state.room}
          onChangeText={room =>
            this.setState({
              room: room
            })
          }
        />

        <Text style={styles.h2}>Report Title</Text>
        <Text style={{ padding: 5 }}>Title: {this.state.title}</Text>
        <SearchableDropdown
          onTextChange={text => {
            this.setState({ title: text });
          }}
          onItemSelect={item => {
            var str = JSON.stringify(item).split(":")[2];
            this.setState({
              title: str.substring(1, str.length - 2)
            });
          }}
          items={titles}
          defaultIndex={0}
          resetValue={true}
          placeholder="Enter report title"
          underlineColorAndroid="transparent"
          containerStyle={styles.containerstyle}
          textInputStyle={styles.inputstyle}
          itemStyle={styles.itemstyle}
        />

        <Text style={styles.h2}>Report Description</Text>
        <Text style={{ padding: 5 }}>
          Description: {this.state.description}
        </Text>
        <SearchableDropdown
          onTextChange={text => this.setState({ description: text })}
          onItemSelect={item => {
            var str = JSON.stringify(item).split(":")[2];
            this.setState({
              description: str.substring(1, str.length - 2)
            });
          }}
          items={descriptions}
          defaultIndex={0}
          resetValue={true}
          placeholder="Enter description"
          underlineColorAndroid="transparent"
          containerStyle={styles.containerstyle}
          textInputStyle={styles.inputstyle}
          itemStyle={styles.itemstyle}
        />

        {this.state.fieldsFilled ? (
          <View />
        ) : (
          <Text style={{ textAlign: "center", color: "#ff0000" }}>
            All fields are required.
          </Text>
        )}

        <View style={{ paddingVertical: 15 }}>
          <Button
            color="#EF7568"
            title="Submit"
            onPress={() => {
              if (
                this.state.room == "" ||
                this.state.title == "" ||
                this.state.description == ""
              ) {
                this.setState({ fieldsFilled: false });
              } else {
                Alert.alert(
                  "Confirmation",
                  "Do you want to send this report?",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel"
                    },
                    {
                      text: "Send",
                      onPress: () => this.sendReport()
                    }
                  ],
                  { cancelable: false }
                );
              }
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    padding: 15
  },
  form: {
    padding: 15,
    borderColor: "#008BE3",
    borderRadius: 10,
    borderWidth: 1
  },
  section: {
    padding: 10
  },
  h1: {
    color: "#EF7568",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 5
  },
  h2: {
    color: "#EF7568",
    fontSize: 16,
    padding: 5
  },
  remaining: {
    color: "#BBBBBB",
    fontSize: 11,
    textAlign: "right",
    paddingRight: 15
  },
  input: {
    height: 40,
    padding: 10
  },
  containerstyle: {
    padding: 5
  },
  inputstyle: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#bbb"
  },
  itemstyle: {
    padding: 10,
    marginTop: 2,
    borderColor: "#bbb",
    borderWidth: 1
  }
});
