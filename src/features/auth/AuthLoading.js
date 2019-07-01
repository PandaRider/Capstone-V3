import React from "react";
import { View, StatusBar, AsyncStorage, ActivityIndicator } from "react-native";

import { connect } from "react-redux";
import { logInSuccess } from "./authActions";

class AuthLoading extends React.Component {
  _getUserToken = async () => {
    try {
      // TODO:
      // Security flaw because userToken is unencrypted. userToken is also not used.
      let data = await AsyncStorage.getItem("userToken");
      let userToken = JSON.parse(data);
      console.log("Output from AsyncStorage: ", userToken);
      return userToken;
    } catch (error) {
      console.log("Something went wrong", error);
      return false;
    }
  };

  componentDidMount() {
    StatusBar.setHidden(true);
    let userToken = this._getUserToken();
    if (userToken) {
      this.props.dispatchLogInSuccess(userToken);
      this.props.navigation.navigate("App");
    } else {
      this.props.navigation.navigate("Auth");
    }
  }

  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = {
  dispatchLogInSuccess: user => logInSuccess(user)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthLoading);
