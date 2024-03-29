/**
 * AddBooking.js is for the user to view the room that they have selected
 * and fill in the booking form to make a booking.
 */

import React from "react";
import {
  ScrollView,
  Text,
  Image,
  Button,
  StyleSheet,
  View,
  TextInput,
  ActivityIndicator
} from "react-native";

import "firebase/firestore";
import Firebase from "../../../Firebase";

var db = Firebase.firestore();
var details = {};

export default class RoomDetails extends React.Component {
  static navigationOptions = {
    title: "Enter Booking Details",
    headerTintColor: "#EF7568"
  };

  constructor(props) {
    super(props);

    // set state variables
    this.state = {
      purpose: "",
      attendees: "",
      date: this.props.navigation.getParam("date"),
      time:
        this.props.navigation.getParam("start") +
        ":00 - " +
        this.props.navigation.getParam("end") +
        ":00",
      gotRoom: false,
      checkPurpose: true,
      checkAttendees: true,
      isLoading: false
    };
  }

  // retrieve room data from firestore
  getRoomDetails() {
    var roomid = this.props.navigation.getParam("roomid");

    db.collection("roomTypes")
      .doc(roomid)
      .get()
      .then(doc => {
        if (!doc.exists) {
          console.log("No such document!");
        } else {
          details = doc.data();
          this.setState({ gotRoom: true });
        }
      })
      .catch(err => {
        console.log("Error getting document", err);
      });
  }

  getAmenities() {
    return details.amenities.map((a, i) => <Text key={i}> - {a}</Text>);
  }

  setBookingId(bookingid) {
    db.collection("userBookings4")
      .doc(bookingid)
      .update({ id: bookingid });
  }

  // push booking data to firestore if there is no clash with existing bookings
  async makeBooking() {
    let [dday, dmonth, dyear] = this.state.date.split("-");
    let startTime = this.props.navigation.getParam("start");
    let endTime = this.props.navigation.getParam("end");

    let diff = endTime - startTime;
    timeslots = [];
    for (let d = 0; d < diff; d++) {
      let inputStr = String(startTime + d);
      timeslots.push(inputStr + "00");
    }

    var dbPromises = [];
    for (var i = 0; i < timeslots.length; i++) {
      dbPromises.push(
        db
          .collection("userBookings4")
          .where("month", "==", parseInt(dmonth))
          .where("day", "==", parseInt(dday))
          .where(timeslots[i], "==", true)
          .where("roomName", "==", details.roomName)
          .get()
      );
    }

    let hasClash = false;
    this.setState({ isLoading: true });
    await Promise.all(dbPromises).then(snapshotArr => {
      snapshotArr.forEach(snapshot => {
        snapshot.forEach(doc => {
          if (doc.exists) hasClash = true;
        });
      });
    });

    if (hasClash == false) {
      let addMe = {
        location:
          "https://cdn2.f-cdn.com/contestentries/484655/17927409/57599f700cef0_thumb900.jpg",
        bookedByUuid: "alice123"
      };
      addMe["date"] = this.state.date;
      addMe["time"] = this.state.time;
      addMe["day"] = parseInt(dday);
      addMe["month"] = parseInt(dmonth);
      addMe["year"] = parseInt(dyear);
      addMe["roomName"] = details.roomName;
      addMe["level"] = details.level;
      addMe["location"] = details.location;
      addMe["purpose"] = this.state.purpose;
      addMe["attendees"] = this.state.attendees;
      timeslots.forEach(t => {
        addMe[t] = true;
      });

      db.collection("userBookings4")
        .add(addMe)
        .then(ref => {
          this.setBookingId(ref.id);
          this.setState({ isLoading: false });
          this.props.navigation.navigate("Home", {
            bookingid: ref.id,
            from_AddBooking: "transit from AddBooking"
          });
        });
    } else {
      this.props.navigation.navigate("SelectDateTime");
    }
  }

  componentWillMount() {
    details = this.getRoomDetails();
  }

  render() {
    // depending on state of data retrieval, display
    // either a loading or the actual screen
    if (this.state.gotRoom && this.state.isLoading == false) {
      return (
        <View style={styles.view}>
          <ScrollView>
            {/* Room detail components */}
            <Text style={styles.h1}>Room Details</Text>
            <View style={styles.section}>
              <Text style={styles.h2}>{details.roomName}</Text>
              <Text>
                Level {details.level}, Capacity of {details.capacity}
              </Text>
            </View>

            <View style={styles.section}>
              <Image
                source={{ uri: details.image }}
                style={{ width: "100%", height: 200 }}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.h2}>Amenities</Text>
              {this.getAmenities()}
            </View>

            <View style={styles.section}>
              <Text style={styles.h2}>Location</Text>
              <Image
                source={{ uri: details.location }}
                style={{ width: "100%", height: 200 }}
              />
            </View>

            {/* Booking form components */}
            <View style={styles.section}>
              <Text style={styles.h1}>Booking Form</Text>
              <Text style={styles.datetime}>Date: {this.state.date}</Text>
              <Text style={styles.datetime}>Time: {this.state.time}</Text>
              <View style={styles.form}>
                <Text style={styles.h2}>Purpose of booking</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter purpose of booking"
                  onChangeText={purpose => this.setState({ purpose })}
                />

                <Text style={styles.h2}>Number of attendees</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter number of attendees"
                  keyboardType="numeric"
                  onChangeText={attendees => this.setState({ attendees })}
                />

                {this.state.checkPurpose ? (
                  <View />
                ) : (
                  <Text style={styles.warning}>All fields are required.</Text>
                )}

                {this.state.checkAttendees ? (
                  <View />
                ) : (
                  <Text style={styles.warning}>
                    Invalid number of attendees.
                  </Text>
                )}
                
                {/* Button to make booking */}
                <Button
                  title="Book"
                  color="#EF7568"
                  onPress={() => {
                    // check that all inputs are valid
                    if (
                      this.state.purpose == "" ||
                      this.state.attendees == ""
                    ) {
                      this.setState({ checkPurpose: false });
                    } else if (
                      parseInt(this.state.attendees) < 1 ||
                      parseInt(this.state.attendees) >
                        parseInt(details.capacity)
                    ) {
                      this.setState({ checkPurpose: true });
                      this.setState({ checkAttendees: false });
                    } else {
                      this.setState({ checkPurpose: true });
                      this.setState({ checkPurpose: true });
                      this.makeBooking();
                    }
                  }}
                />
              </View>
            </View>
          </ScrollView>
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
    marginVertical: 15,
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
    fontSize: 16
  },
  warning: {
    color: "red",
    fontSize: 11,
    paddingBottom: 15,
    textAlign: "center"
  },
  datetime: {
    color: "#EF7568",
    fontSize: 16,
    textAlign: "center"
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
