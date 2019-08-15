/**
 * ModifyBooking.js is for the user to modify a the purpose of booking and
 * number of attendees for the booking they have already made.
 */

import React from "react";
import {
  Text,
  Button,
  StyleSheet,
  View,
  TextInput,
  ActivityIndicator
} from "react-native";

import "firebase/firestore";
import Firebase from "../../../Firebase";

var db = Firebase.firestore();

var maxchars = 30;
var details = {};

export default class ModifyBooking extends React.Component {
  static navigationOptions = {
    title: "Modify Booking",
    headerTintColor: "#EF7568"
  };

  // set state variables
  state = {
    charsleft: maxchars,
    purpose: "",
    attendees: "",
    date: "",
    time: "",
    gotBooking: false
  };

  // retrieve booking data from firestore
  getBookingDetails() {
    var bookingid = this.props.navigation.getParam("bookingid");
    db.collection("userBookings4")
      .doc(bookingid)
      .get()
      .then(doc => {
        if (!doc.exists) {
          console.log("No such document!");
        } else {
          details = doc.data();
          this.setState({
            purpose: details.purpose,
            attendees: details.attendees,
            date: details.date,
            time: details.time,
            gotBooking: true
          });
        }
      })
      .catch(err => {
        console.log("Error getting document", err);
      });
  }

  // push modified booking data to firestore
  updateBooking() {
    db.collection("userBookings4")
      .doc(details.id)
      .update({
        purpose: this.state.purpose,
        attendees: this.state.attendees,
        date: this.state.date,
        time: this.state.time
      });
    this.props.navigation.navigate("UpcomingBooking", {
      bookingid: details.id
    });
  }

  componentWillMount() {
    details = this.getBookingDetails();
  }

  render() {
    // depending on state of data retrieval, display
    // either a loading or the actual screen
    if (this.state.gotBooking) {
      return (
        <View style={styles.section}>
          {/* Booking modification form components */}
          <Text style={styles.h1}>Booking Form</Text>
          <View style={styles.form}>
            <Text style={styles.h2}>Purpose of booking</Text>
            <TextInput
              style={styles.input}
              placeholder={details.purpose}
              maxLength={maxchars}
              onChangeText={purpose =>
                this.setState({
                  purpose,
                  charsleft: maxchars - purpose.length
                })
              }
            />
            <Text style={styles.remaining}>{this.state.charsleft}</Text>

            <Text style={styles.h2}>Number of attendees</Text>
            <TextInput
              style={styles.input}
              placeholder={details.attendees}
              keyboardType="numeric"
              onChangeText={attendees => this.setState({ attendees })}
            />

            <View style={{ paddingVertical: 15 }}>
              {/* Button to modify booking */}
              <Button
                color="#EF7568"
                title="Update"
                onPress={() => this.updateBooking()}
              />
            </View>
          </View>
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
    padding: 15
  },
  form: {
    padding: 15,
    borderColor: "#EF7568",
    borderRadius: 10,
    borderWidth: 1
  },
  section: {
    padding: 10
  },
  h1: {
    color: "#EF7568",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 5
  },
  h2: {
    color: "#EF7568",
    fontSize: 16,
    padding: 5,
    fontWeight: "bold"
  },
  remaining: {
    color: "#BBBBBB",
    fontSize: 11,
    textAlign: "right",
    paddingRight: 15
  },
  input: {
    height: 40,
    padding: 10
  },
  picker: {
    width: 200
  },
  timeinput: {
    flexDirection: "row",
    padding: 5
  }
});
