import React, { Component } from "react";
import { Text, View, TextInput, StyleSheet, Image, Modal } from "react-native";
import { connect } from "react-redux";
import * as firebase from "firebase";

import { signIn } from "./authActions";
import { fonts, colors } from "../../styles/theme";

import Input from "../../components/Input";
import Button from "../../components/Button";

class SignIn extends React.Component {
  state = {
    email: "",
    password: ""
  };

  onChangeText = (key, value) => {
    this.setState({
      [key]: value
    });
  };

  signIn() {
    const { email, password } = this.state;
    this.props.dispatchSignIn(email, password);
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      // probably unnecessary
      // console.log("Output from reducer is: ", this.props.auth.user);
      // console.log("current user is: ", firebase.auth().currentUser);
      if (this.props.auth.user.email !== undefined) {
        this.props.navigation.navigate("App");
      }
    }
  }

  render() {
    // const { fontsLoaded } = this.state;
    const {
      auth: { signInErrorMessage, isAuthenticating, signInError }
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.heading}>
          <Image
            source={require("../../assets/shape.png")}
            style={styles.headingImage}
            resizeMode="contain"
          />
        </View>
        <Text style={[styles.greeting]}>Welcome back,</Text>
        <Text style={[styles.greeting2]}>sign in to continue</Text>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Email"
            type="email"
            onChangeText={this.onChangeText}
            value={this.state.username}
          />
          <Input
            placeholder="Password"
            type="password"
            onChangeText={this.onChangeText}
            value={this.state.password}
            secureTextEntry
          />
        </View>

        <Button
          isLoading={isAuthenticating}
          title="Sign In"
          onPress={this.signIn.bind(this)}
        />
        <Text style={[styles.errorMessage, signInError && { color: "black" }]}>
          Error logging in. Please try again.
        </Text>
        <Text style={[styles.errorMessage, signInError && { color: "black" }]}>
          {signInErrorMessage}
        </Text>
      </View>
    );
  }
}

const mapDispatchToProps = {
  dispatchSignIn: (email, password) => signIn(email, password)
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn);

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  heading: {
    flexDirection: "row"
  },
  headingImage: {
    width: 38,
    height: 38
  },
  errorMessage: {
    fontSize: 12,
    marginTop: 10,
    color: "transparent",
    fontFamily: fonts.base
  },
  inputContainer: {
    marginTop: 20
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 40
  },
  greeting: {
    marginTop: 20,
    fontSize: 24,
    fontFamily: fonts.light
  },
  greeting2: {
    color: "#666",
    fontSize: 24,
    marginTop: 5,
    fontFamily: fonts.light
  }
});
