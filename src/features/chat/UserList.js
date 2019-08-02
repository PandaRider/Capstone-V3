import React from "react";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import "firebase/firestore";
import Firebase from "../../../Firebase";

var db = Firebase.firestore();

export default class ChatScreen extends React.Component {
  state = {
    colleagueList: [],
    gotColleagueList: false
  };

  getColleagueList = () => {
    db.collection("users")
      .orderBy("name")
      .get()
      .then(snapshot => {
        const items = [];
        snapshot.forEach(doc => {
          items.push(doc.data());
        });
        this.setState({
          colleagueList: items,
          gotColleagueList: true
        });
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
  };

  getColleagueListItem() {
    return this.state.colleagueList.map((data, i) => {
      return (
        <Text
          key={i}
          style={styles.item}
          onPress={() =>
            this.props.navigation.navigate("Chat", {
              colleagueid: data.uid,
              colleaguename: data.name
            })
          }
        >
          {data.name}
        </Text>
      );
    });
  }

  componentDidMount() {
    this.getColleagueList();
  }

  render() {
    if (this.state.gotColleagueList == true) {
      return (
        <View style={styles.view}>
          <Text style={styles.h1}>All Chats</Text>
          <ScrollView>{this.getColleagueListItem()}</ScrollView>
        </View>
      );
    } else {
      return (
        <View>
          <ActivityIndicator size="large" color="#0000ff" />
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
  h1: {
    color: "#EF7568",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 5
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EF7568",
    color: "#EF7568"
  }
});
