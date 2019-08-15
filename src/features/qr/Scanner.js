/**
 * Scanner.js is for the user to scan a QR code to start the room usage.
 */

import * as React from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";

import "firebase/firestore";
import firebase from "../../../Firebase";
import * as FileSystem from "expo-file-system";

var userid = "";
const file = `${FileSystem.documentDirectory}/userid`;
FileSystem.readAsStringAsync(file).then(result => {
  userid = result;
});

export default class BarcodeScannerExample extends React.Component {
  static navigationOptions = () => ({
    tabBarIcon: ({ tintColor }) => (
      <Icon style={[{ color: tintColor }]} size={25} name={"ios-qr-scanner"} />
    ),
    activeTintColor: "white"
  });

  // set state variables
  state = {
    hasCameraPermission: null,
    scanned: false
  };

  // obtain camera permissions
  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  render() {
    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View style={{ flex: 1, justifyContent: "flex-end", margin: 20 }}>
        {/* QR scanner components */}
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.center}>
          <View style={styles.qrbox} />
        </View>
      </View>
    );
  }

  // Register scan of QR code
  handleBarCodeScanned = ({ data }) => {
    room = this.props.navigation.getParam("room");

    if (data == room) {
      alert(`Verification successful!`);

      var newScore;

      const ref = firebase
        .firestore()
        .collection("users")
        .doc(userid);

      // update score if verification is successful
      firebase
        .firestore()
        .runTransaction(async transaction => {
          const doc = await transaction.get(ref);
          newScore = doc.data().score + 1;
          transaction.update(ref, {
            score: newScore
          });
        })
        .then(res => {
          this.props.navigation.navigate("Profile", {
            score: newScore
          });
        });
    } else {
      alert("Verifcation failed!");
    }
    this.setState({ scanned: true });
  };
}

const styles = StyleSheet.create({
  center: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  qrbox: {
    width: 200,
    height: 200,
    borderColor: "red",
    borderWidth: 3
  }
});
