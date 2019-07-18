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
    db.collection("users")
      .doc(userid)
      .get()
      .then(doc => {
        this.state.score = doc.data().score;
      });
  }

  getImage() {
    if (this.state.score == 0) {
      return (
        <Image
          source={{
            uri:
              "https://www.citizenm.com/cache/images/citizenm_rott_mtg-0156_005a44cc5a24cc.jpg"
          }}
          style={{ width: "100%", height: 200 }}
        />
      );
    } else if (this.state.score == 1) {
      return (
        <Image
          source={{
            uri:
              "https://www.geigerfurniture.com/content/dam/ggrcom/page_assets/inspiration/ggr_uw_isp_conference_rooms_01.jpg"
          }}
          style={{ width: "100%", height: 200 }}
        />
      );
    } else {
      return (
        <Image
          source={{
            uri:
              "https://wearespaces.com/toby/img/meeting-rooms-half-day-rental.jpg"
          }}
          style={{ width: "100%", height: 200 }}
        />
      );
    }
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
        </ScrollView>

        {this.getImage()}
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
