import React, { Component } from "react";
import { Button, Text, View, StyleSheet, Alert } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";

var maxchars = 30;

export default class ReportScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon style={[{ color: tintColor }]} size={25} name={"ios-alert"} />
    ),
    activeTintColor: "white"
  };

  state = {
    title: "",
    description: "",
    charsleft: maxchars
  };

  render() {
    return (
      <View style={styles.view}>
        <Text style={styles.h1}>Report</Text>
        <Text style={styles.h2}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder={"Enter title here"}
          maxLength={maxchars}
          onChangeText={title =>
            this.setState({
              title: title,
              charsleft: maxchars - title.length
            })
          }
        />
        <Text style={styles.remaining}>{this.state.charsleft}</Text>

        <Text style={styles.h2}>Detailed Description</Text>
        <TextInput
          style={styles.input}
          multiline={true}
          height={70}
          placeholder={"Enter description here"}
          onChangeText={description =>
            this.setState({
              description: description
            })
          }
        />

        <View style={{ paddingVertical: 15 }}>
          <Button
            color="#EF7568"
            title="Submit"
            onPress={() =>
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
                    onPress: () => this.props.navigation.navigate("Home")
                  }
                ],
                { cancelable: false }
              )
            }
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
  }
});
