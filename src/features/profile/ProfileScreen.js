import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator
} from "react-native";
import { ListItem } from "react-native-elements";
import DialogInput from "react-native-dialog-input";
import Icon from "react-native-vector-icons/Ionicons";

import "firebase/firestore";
import Firebase from "../../../Firebase";
import * as FileSystem from "expo-file-system";

var userid = "";
var db = Firebase.firestore();

var username = "Sally Brown";
var email = "sally_brown@stengg.com";
var currentScore;

export default class ProfileScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon style={[{ color: tintColor }]} size={25} name={"ios-person"} />
    ),
    activeTintColor: "white"
  };

  state = {
    nameVisible: false,
    emailVisible: false,
    nameFilled: true,
    emailFilled: true,
    score: currentScore,
    gotBaseScore: false
  };

  getBaseScore() {
    const file = `${FileSystem.documentDirectory}/userid`;
    FileSystem.readAsStringAsync(file).then(result => {
      userid = result;
      db.collection("users")
        .doc(userid)
        .get()
        .then(doc => {
          currentScore = doc.data().score;
          this.setState({ gotBaseScore: true });
        });
    });
  }

  getScore() {
    currentScore = this.props.navigation.getParam("score");
    this.setState({ score: currentScore });
  }

  getImage() {
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

  toggleName = () => {
    this.setState({ nameVisible: !this.state.nameVisible });
  };

  toggleEmail = () => {
    this.setState({ emailVisible: !this.state.emailVisible });
  };

  toggleNameFilled = () => {
    this.setState({ nameFilled: !this.state.nameFilled });
  };

  toggleEmailFilled = () => {
    this.setState({ emailFilled: !this.state.emailFilled });
  };

  componentWillMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.getScore();
    });
  }

  componentDidMount() {
    if (!this.state.gotBaseScore) {
      this.getBaseScore();
    }
  }

  render() {
    if (this.state.gotBaseScore) {
      return (
        <View style={styles.view}>
          <Text style={styles.h1}>Profile</Text>

          <DialogInput
            isDialogVisible={this.state.nameVisible}
            title={"Edit Name"}
            message={
              this.state.nameFilled ? "Enter new name" : "New name is required"
            }
            hintInput={username}
            submitInput={text => {
              if (text == "") {
                if (this.state.nameFilled) {
                  this.toggleNameFilled();
                }
              } else {
                username = text;
                if (!this.state.nameFilled) {
                  this.toggleNameFilled();
                }
                this.toggleName();
              }
            }}
            closeDialog={() => {
              if (!this.state.nameFilled) {
                this.toggleNameFilled();
              }
              this.toggleName();
            }}
          />

          <DialogInput
            isDialogVisible={this.state.emailVisible}
            title={"Edit Email"}
            message={
              this.state.emailFilled
                ? "Enter new email"
                : "New email is required"
            }
            hintInput={email}
            submitInput={text => {
              if (text == "") {
                if (this.state.emailFilled) {
                  this.toggleEmailFilled();
                }
              } else {
                email = text;
                if (!this.state.emailFilled) {
                  this.toggleEmailFilled();
                }
                this.toggleEmail();
              }
            }}
            closeDialog={() => {
              if (!this.state.emailFilled) {
                this.toggleEmailFilled();
              }
              this.toggleEmail();
            }}
          />

          <ScrollView>
            <ListItem
              title="Username"
              subtitle={username}
              rightAvatar={
                <Icon name={"ios-create"} size={20} onPress={this.toggleName} />
              }
            />
            <ListItem
              title="Email"
              subtitle={email}
              rightAvatar={
                <Icon
                  name={"ios-create"}
                  size={20}
                  onPress={this.toggleEmail}
                />
              }
            />

            <Text style={styles.beanstalk}>My Beanstalk Growth</Text>
            <Text style={{ textAlign: "center", paddingBottom: 10 }}>
              Current room usage streak is at {currentScore}!
            </Text>
            {this.getImage()}
          </ScrollView>
        </View>
      );
    } else {
      return <ActivityIndicator />;
    }
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff"
  },
  center: {
    alignItems: "center",
    backgroundColor: "white"
  },
  h1: {
    color: "#EF7568",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 5,
    backgroundColor: "white"
  },
  h2: {
    color: "#EF7568",
    fontSize: 16
  },
  beanstalk: {
    color: "#EF7568",
    fontSize: 16,
    paddingBottom: 10,
    textAlign: "center"
  },
  input: {
    paddingVertical: 10
  },

  alignbtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10
  }
});
