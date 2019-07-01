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
  state = {
    charsleft: maxchars,
    purpose: "",
    attendees: "",
    date: "",
    time: "",
    gotBooking: false
  };

  getBookingDetails() {
    var bookingid = this.props.navigation.getParam("bookingid");

    db.collection("fakebookings")
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

  updateBooking() {
    db.collection("fakebookings")
      .doc(details.id)
      .update({
        purpose: this.state.purpose,
        attendees: this.state.attendees,
        date: this.state.date,
        time: this.state.time
      });
    this.props.navigation.navigate("ViewBooking", { bookingid: details.id });
  }

  componentWillMount() {
    details = this.getBookingDetails();
  }

  render() {
    if (this.state.gotBooking) {
      return (
        <View style={styles.section}>
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

            <Text style={styles.h2}>Date</Text>
            <TextInput
              style={styles.input}
              placeholder={details.date}
              onChangeText={date => this.setState({ date })}
            />

            <Text style={styles.h2}>Time</Text>
            <TextInput
              style={styles.input}
              placeholder={details.time}
              onChangeText={time => this.setState({ time })}
            />

            <Button title="Update" onPress={() => this.updateBooking()} />
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
    borderColor: "#008BE3",
    borderRadius: 10,
    borderWidth: 1
  },
  section: {
    padding: 10
  },
  h1: {
    color: "#008BE3",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 5
  },
  h2: {
    color: "#008BE3",
    fontSize: 16
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
  }
});
