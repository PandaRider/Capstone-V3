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

// get and set current datetime values
var day = new Date().getDate();
var month = new Date().getMonth() + 1;
var year = new Date().getFullYear();
var datetoday = day + "-" + month + "-" + year;
var hours = new Date().getHours();
var timestart = hours;
var timeend = hours + 1;

var db = Firebase.firestore();

// a mock current booking has been created to demonstrate the feature
const current = {
  attendees: "6",
  date: datetoday,
  location:
    "https://cdn2.f-cdn.com/contestentries/484655/17927409/57599f700cef0_thumb900.jpg",
  purpose: "Quality Analysis",
  roomName: "Onyx Room",
  time: timestart + ":00 - " + timeend + ":00",
  id: "mToRcBgct3DyFWbLry4V",
  level: "8"
};

class Home extends React.Component {
  static navigationOptions = {
    title: "All Bookings",
    headerTintColor: "#EF7568"
  };

  // set state variables
  state = {
    username: "",
    isLoggedIn: true,
    user: {},
    hasCurrent: true,
    gotUpcoming: false,
    hasUpcoming: false,
    upcomingList: []
  };

  logout() {
    this.props.dispatchLogout();
    this.props.navigation.navigate("SignIn");
  }

  // display mock current booking
  getCurrentBooking() {
    return (
      <ListItem
        key={0}
        title={
          <Text>
            {current.purpose} @ {current.roomName}
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

  // retrieve upcoming bookings data from firestore
  getUpcomingBookings() {
    db.collection("userBookings4")
      .orderBy("date")
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

  // generate upcoming bookings components
  getUpcomingBookingsItem() {
    return this.state.upcomingList.map((l, i) => (
      <ListItem
        key={i}
        title={
          <Text>
            {l.purpose} @ {l.roomName}
          </Text>
        }
        subtitle={
          <Text>
            {l.date}, {l.time}
          </Text>
        }
        containerStyle={styles.upcominglistitem}
        onPress={() =>
          this.props.navigation.navigate("UpcomingBooking", { bookingid: l.id })
        }
      />
    ));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps != this.props) {
      let ab = this.props.navigation.getParam("from_AddBooking", "try again");
      if (ab == "transit from AddBooking") {
        db.collection("userBookings4")
          .where("bookedByUuid", "==", "alice123")
          .get()
          .then(snapshot => {
            let items = [];
            snapshot.forEach(doc => {
              items.push(doc.data());
            });
            this.setState({
              upcomingList: items,
              hasUpcoming: true,
              gotUpcoming: true
            });
          });
      }
    }
  }

  componentDidMount() {
    this.getUpcomingBookings();
    this.setState({
      hasCurrent:
        this.props.navigation.getParam("hascurrent") == false ? false : true
    });
  }

  render() {
    // depending on state of data retrieval, display
    // either a loading or the actual screen
    if (this.state.gotUpcoming) {
      return (
        <View style={styles.view}>
          {/* Current booking components */}
          <View style={styles.currentview}>
            <Text style={styles.h1}>My Current Bookings</Text>
            {this.state.hasCurrent ? (
              this.getCurrentBooking()
            ) : (
              <Text style={styles.niltext}>No current booking</Text>
            )}
          </View>

          {/* Upcoming bookings components */}
          <Text style={styles.h1}>My Upcoming Bookings</Text>
          {this.state.hasUpcoming ? (
            <ScrollView>{this.getUpcomingBookingsItem()}</ScrollView>
          ) : (
            <Text style={styles.niltext}>No upcoming bookings</Text>
          )}

          <View style={styles.bottomview}>
            {/* Button to log out */}
            <Button
              title={"Logout"}
              color="#EF7568"
              onPress={this.logout.bind(this)}
            />
          </View>

          {/* Button to add a new booking */}
          <ActionButton
            size={70}
            buttonText="New Booking"
            buttonTextStyle={{ fontSize: 15, textAlign: "center" }}
            buttonColor="#f85441"
            shadowStyle={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 0
            }}
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
    borderColor: "#EF7568",
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
    color: "#EF7568",
    fontSize: 18,
    fontWeight: "bold",
    paddingLeft: 15
  },
  niltext: {
    paddingLeft: 15
  }
});
