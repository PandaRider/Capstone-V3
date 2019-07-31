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
  console.log("chat uid exists: " + result);
  userid = result;
});

export default class BarcodeScannerExample extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon style={[{ color: tintColor }]} size={25} name={"ios-qr-scanner"} />
    ),
    activeTintColor: "white"
  });

  state = {
    hasCameraPermission: null,
    scanned: false
  };

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
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        {scanned && (
          <Button
            color="#EF7568"
            title={"Tap to Scan Again"}
            onPress={() => this.setState({ scanned: false })}
          />
        )}
        <View style={styles.center}>
          <View style={styles.qrbox} />
        </View>
      </View>
    );
  }

  handleBarCodeScanned = ({ type, data }) => {
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    room = this.props.navigation.getParam("room");

    if (data == room) {
      alert(`Verification successful!`);

      var newScore;

      const ref = firebase
        .firestore()
        .collection("users")
        .doc(userid);

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
          console.log("in scanner screen, newscore is " + newScore);
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

// https://rnfirebase.io/docs/v5.x.x/firestore/transactions#Increment-a-value
