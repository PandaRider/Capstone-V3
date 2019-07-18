import React, { Component } from "react";
import { Button, Text, View, StyleSheet, ScrollView } from "react-native";
import { ListItem } from "react-native-elements";
import Modal from "react-native-modal";
import { TextInput } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";

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
    email: email
  };

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  toggleEmailModal = () => {
    this.setState({ isEmailModalVisible: !this.state.isEmailModalVisible });
  };

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
