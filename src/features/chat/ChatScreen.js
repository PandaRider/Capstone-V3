/**
 * ChatScreen.js is for the user to chat with other registered users.
 */

import React from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { Bubble, GiftedChat } from "react-native-gifted-chat";

import "firebase/firestore";
import Firebase from "../../../Firebase";
import * as FileSystem from "expo-file-system";

var userid = "";
const file = `${FileSystem.documentDirectory}/userid`;
FileSystem.readAsStringAsync(file).then(result => {
  userid = result;
});

var db = Firebase.firestore();

export default class ChatScreen extends React.Component {
  // set state variables
  state = {
    messages: [],
    database: ""
  };

  sender = {
    _id: userid
  };

  // retrieve chat data from firestore
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

  // send a new message
  addMessage = messages => {
    db.collection(this.state.database)
      .add({
        _id: messages[0]._id,
        text: messages[0].text,
        createdAt: new Date().toString(),
        user: this.sender
      })
      .then(this.getMessageList());
  };

  // set the database id to retrieve chat history from
  getChat = () => {
    var colleagueid = this.props.navigation.getParam("colleagueid");
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
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.getChat();
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.view}>
        {/* Button to view list of users */}
        <Button
          color="#EF7568"
          title={"Return to Chats"}
          onPress={() => navigate("Users")}
        />

        {/* Chat components */}
        <Text style={styles.colleague}>
          {this.props.navigation.getParam("colleaguename")}
        </Text>
        <GiftedChat
          messages={this.state.messages}
          renderBubble={props => {
            return (
              <Bubble
                {...props}
                wrapperStyle={{
                  right: {
                    backgroundColor: "#EF7568"
                  }
                }}
              />
            );
          }}
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
