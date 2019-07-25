import React, { Component } from "react";
import {
  Button,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image
} from "react-native";
import { ListItem } from "react-native-elements";
import Modal from "react-native-modal";
import { TextInput } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";

import "firebase/firestore";
import Firebase from "../../../Firebase";
import * as FileSystem from "expo-file-system";

var currentScore;
var userid = "";
const file = `${FileSystem.documentDirectory}/userid`;
FileSystem.readAsStringAsync(file).then(result => {
  userid = result;
  db.collection("users")
    .doc(userid)
    .get()
    .then(doc => {
      currentScore = doc.data().score;
    });
});

var db = Firebase.firestore();

var username = "Sally Brown";
var email = "sally_brown@stengg.com";

export default class ProfileScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon style={[{ color: tintColor }]} size={25} name={"ios-person"} />
    ),
    activeTintColor: "white"
  };

  state = {
    isModalVisible: false,
    isEmailModalVisible: false,
    username: username,
    email: email,
    score: currentScore
  };

  getScore() {
    currentScore = this.props.navigation.getParam("score");
    console.log("getting score..." + currentScore)
    this.state.score = currentScore;
  }

  getImage() {
    console.log("generating image, currentScore is " + currentScore)
    var image = "";

    if (currentScore == 0) {
      image =
        "https://drive.google.com/uc?id=1_bKfubAsfLfABCxuXsDJNKA4xURb-cgE";
    } else if (currentScore == 1) {
      image =
        "https://drive.google.com/uc?id=1mq8c9ByD9c_q2a2Ppz902TmWsb6-p-Gg";
    } else if (currentScore == 2) {
      image =
        "https://drive.google.com/uc?id=1YFLtOni7mUuYcNVpXgKFjZHiPC2DgWu-";
    } else if (currentScore == 3) {
      image =
        "https://drive.google.com/uc?id=1k9xZ7LgbXCN-lclZU6zIk2wQWErSAEFG";
    } else if (currentScore >= 4) {
      image =
        "https://drive.google.com/uc?id=1BeV1tn8yz9wTHezwRhrMlt1-jHUvmzSg";
    }

    return (
      <Image
        source={{
          uri: image
        }}
        style={{ width: "100%", height: 650 }}
      />
    );
  }

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  toggleEmailModal = () => {
    this.setState({ isEmailModalVisible: !this.state.isEmailModalVisible });
  };

  componentWillMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.getScore();
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Modal isVisible={this.state.isModalVisible}>
          <View style={styles.center}>
            <View style={{ paddingVertical: 30 }}>
              <Text style={styles.h2}>Enter new name</Text>

              <TextInput
                placeholder={username}
                onChangeText={username => this.setState({ username })}
              />

              <Button
                title="Update"
                onPress={() => {
                  username = this.state.username;
                  this.toggleModal();
                }}
              />
            </View>
          </View>
        </Modal>
        <Modal isVisible={this.state.isEmailModalVisible}>
          <View style={styles.center}>
            <View style={{ paddingVertical: 30 }}>
              <Text style={styles.h2}>Enter new email</Text>

              <TextInput
                placeholder={email}
                onChangeText={email => this.setState({ email })}
              />

              <Button
                title="Update"
                onPress={() => {
                  email = this.state.email;
                  this.toggleEmailModal();
                }}
              />
            </View>
          </View>
        </Modal>
        <ScrollView>
          <ListItem
            title="Username"
            subtitle={username}
            rightAvatar={
              <Icon name={"ios-create"} size={20} onPress={this.toggleModal} />
            }
          />
          <ListItem
            title="Email"
            subtitle={email}
            rightAvatar={
              <Icon
                name={"ios-create"}
                size={20}
                onPress={this.toggleEmailModal}
              />
            }
          />

          {this.getImage()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    backgroundColor: "white"
  },
  h2: {
    color: "#008BE3",
    fontSize: 16
  }
});
