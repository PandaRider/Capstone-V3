import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { ListItem } from "react-native-elements";
import ActionButton from "react-native-action-button";

import { connect } from "react-redux";
import { logOutAndClearToken } from "../features/auth/authActions";

import "firebase/firestore";
import Firebase from "../../Firebase";

var db = Firebase.firestore();

const current = {
  attendees: "6",
  date: "13-06-2019",
  location:
    "https://cdn2.f-cdn.com/contestentries/484655/17927409/57599f700cef0_thumb900.jpg",
  purpose: "Quality Analysis",
  room: "Onyx Room",
  time: "9:00 - 12:00",
  id: "mToRcBgct3DyFWbLry4V",
  level: "8"
};

class Home extends React.Component {
  state = {
    username: "",
    isLoggedIn: true,
    user: {},
    // Implement check for current
    hasCurrent: true,
    gotUpcoming: false,
    hasUpcoming: false,
    upcomingList: []
  };

  logout() {
    this.props.dispatchLogout();
    this.props.navigation.navigate("SignIn");
  }

  getCurrentBooking() {
    return (
      <ListItem
        key={0}
        title={
          <Text>
            {current.purpose} @ {current.room}
          </Text>
        }
        subtitle={
          <Text>
            {current.date}, {current.time}
          </Text>
        }
        onPress={() =>
          this.props.navigation.navigate("CurrentBooking", { current: current })
        }
      />
    );
  }

  getUpcomingBookings() {
    db.collection("fakebookings")
      .orderBy("date") // TODO: order by proper datetime format instead
      .get()
      .then(snapshot => {
        const items = [];
        snapshot.forEach(doc => {
          items.push(doc.data());
        });
        this.setState({
          upcomingList: items,
          hasUpcoming: true,
          gotUpcoming: true
        });
      })
      .catch(err => {
        console.log("Error getting documents", err);
        this.setState({
          hasUpcoming: false,
          gotUpcoming: true
        });
      });
  }

  getUpcomingBookingsItem() {
    return this.state.upcomingList.map((l, i) => (
      <ListItem
        key={i}
        title={
          <Text>
            {l.purpose} @ {l.room}
          </Text>
        }
        subtitle={
          <Text>
            {l.date}, {l.time}
          </Text>
        }
        containerStyle={styles.upcominglistitem}
        onPress={() =>
          this.props.navigation.navigate("ViewBooking", { bookingid: l.id })
        }
      />
    ));
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.getUpcomingBookings();
      this.setState({
        hasCurrent:
          this.props.navigation.getParam("hascurrent") == false ? false : true
      });
    });
  }

  render() {
    if (this.state.gotUpcoming) {
      return (
        <View style={styles.view}>
          <View style={styles.currentview}>
            <Text style={styles.h1}>Current Session</Text>
            {this.state.hasCurrent ? (
              this.getCurrentBooking()
            ) : (
              <Text style={styles.niltext}>No current session</Text>
            )}
          </View>
          <Text style={styles.h1}>Upcoming Sessions</Text>
          {this.state.hasUpcoming ? (
            <ScrollView>{this.getUpcomingBookingsItem()}</ScrollView>
          ) : (
            <Text style={styles.niltext}>No upcoming sessions</Text>
          )}
          <View style={styles.bottomview}>
            <Button title={"Logout"} onPress={this.logout.bind(this)} />
          </View>
          <ActionButton
            buttonColor="#1253BC"
            onPress={() => this.props.navigation.navigate("SelectDateTime")}
          />
        </View>
      );
    } else {
      return <ActivityIndicator />;
    }
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = {
  dispatchLogout: () => logOutAndClearToken()
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

const styles = StyleSheet.create({
  view: {
    flex: 1
  },
  currentview: {
    backgroundColor: "white",
    padding: 10,
    margin: 10,
    borderColor: "#008BE3",
    borderRadius: 10,
    borderWidth: 1
  },
  bottomview: {
    width: "100%",
    padding: 10,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    backgroundColor: "white"
  },
  upcominglistitem: {
    borderBottomColor: "#eeeeee",
    borderBottomWidth: 1
  },
  h1: {
    color: "#008BE3",
    fontSize: 18,
    fontWeight: "bold",
    paddingLeft: 15
  },
  niltext: {
    paddingLeft: 15
  }
});
