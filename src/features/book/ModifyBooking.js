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
import DatePicker from "react-native-datepicker";

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
            <DatePicker
              style={styles.picker}
              mode="date" //The enum of date, datetime and time
              placeholder="Select date"
              format="DD-MM-YYYY"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={false}
              onDateChange={date => {
                this.setState({ date: date });
              }}
            />

            <Text style={styles.h2}>Time</Text>
            <View style={styles.timeinput}>
              <Text style={styles.h2}>Start time</Text>
              <DatePicker
                style={styles.picker}
                mode="time" //The enum of date, datetime and time
                placeholder="Select start time"
                format="hh:mm"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon={false}
                onDateChange={starttime => {
                  this.setState({ starttime: starttime });
                }}
              />
            </View>
            <View style={styles.timeinput}>
              <Text style={styles.h2}> End time </Text>
              <DatePicker
                style={styles.picker}
                mode="time" //The enum of date, datetime and time
                placeholder="Select end time"
                format="hh:mm"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon={false}
                onDateChange={endtime => {
                  this.setState({ endtime: endtime });
                }}
              />
            </View>

            <View style={{ paddingVertical: 15 }}>
              <Button title="Update" onPress={() => this.updateBooking()} />
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
