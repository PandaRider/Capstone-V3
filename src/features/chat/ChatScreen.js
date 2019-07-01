import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import { GiftedChat } from "react-native-gifted-chat";

import "firebase/firestore";
import Firebase from "../../../Firebase";
import * as FileSystem from "expo-file-system";

var userid = "";
const file = `${FileSystem.documentDirectory}/userid`;
FileSystem.readAsStringAsync(file).then(result => {
  console.log("chat uid exists: " + result);
  userid = result;
});

var db = Firebase.firestore();

export default class ChatScreen extends React.Component {
  state = {
    messages: [],
    database: ""
  };

  sender = {
    _id: userid
    // name: "" // without 'avatar' prop, the name initials will be rendered instead
  };

  getMessageList = () => {
    db.collection(this.state.database)
      .orderBy("createdAt", "desc")
      .get()
      .then(snapshot => {
        const items = [];
        snapshot.forEach(doc => {
          items.push(doc.data());
        });
        this.setState({ messages: items });
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
  };

  addMessage = messages => {
    db.collection(this.state.database)
      .add({
        _id: messages[0]._id,
        text: messages[0].text,
        createdAt: new Date().toString(), // firestore converts new Date() to a Timestamp which will not be parsed correctly by gifted-chat, hence need toString()
        user: this.sender
      })
      .then(this.getMessageList());
  };

  getChat = () => {
    var colleagueid = this.props.navigation.getParam("colleagueid");
    console.log(userid, "and", colleagueid);
    var database;
    if (userid < colleagueid) {
      database = userid + colleagueid;
    } else {
      database = colleagueid + userid;
    }

    this.setState(
      () => ({
        database: database
      }),
      () => {
        this.getMessageList();
      }
    );
  };

  componentDidMount() {
    // https://reactnavigation.org/docs/en/function-after-focusing-screen.html
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.getChat();
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.view}>
        <Button onPress={() => navigate("Users")} title="Return to Chats" />
        <Text style={styles.colleague}>
          {this.props.navigation.getParam("colleaguename")}
        </Text>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.addMessage(messages)}
          user={{
            _id: userid
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1
  },
  colleague: {
    textAlign: "center",
    color: "#aaaaaa",
    fontWeight: "bold",
    fontSize: 18,
    padding: 10
  }
});
