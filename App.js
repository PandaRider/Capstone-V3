import React from "react";
import { ActivityIndicator } from "react-native";
import { createAppContainer } from "react-navigation";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./src/reducers";
import thunk from "redux-thunk";

import Nav from "./src/navigation/Nav";

import "firebase/firestore";
import Firebase from "./Firebase";
import * as FileSystem from "expo-file-system";
import uuid from "uuid";

console.disableYellowBox = true;

var db = Firebase.firestore();
const idfile = `${FileSystem.documentDirectory}/userid`;

FileSystem.getInfoAsync(idfile).then(file => {
  if (file.exists) {
    FileSystem.readAsStringAsync(idfile);
  } else {
    var userid = uuid();
    FileSystem.writeAsStringAsync(idfile, userid);
    db.collection("users")
      .doc(userid)
      .set({
        name: "User " + userid.substring(0, 8),
        uid: userid,
        score: 0
      });
  }
});

const store = createStore(rootReducer, applyMiddleware(thunk));
const Navigation = createAppContainer(Nav);

export default class App extends React.Component {
  state = {
    fontLoaded: false
  };
  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      ...Ionicons.font
    });
    this.setState({ fontLoaded: true });
  }

  render() {
    if (!this.state.fontLoaded) {
      return <ActivityIndicator />;
    }
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    );
  }
}
