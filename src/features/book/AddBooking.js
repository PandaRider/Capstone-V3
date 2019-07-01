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

var maxchars = 30;
var details = {};

export default class RoomDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      charsleft: maxchars,
      purpose: "",
      attendees: "",
      date: "",
      time: "",
      gotRoom: false
    };
  }

  getRoomDetails() {
    var roomid = this.props.navigation.getParam("roomid");

    db.collection("fakerooms")
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
    db.collection("fakebookings")
      .doc(bookingid)
      .update({ id: bookingid });
  }

  makeBooking() {
    db.collection("fakebookings")
      .add({
        room: details.room,
        purpose: this.state.purpose,
        attendees: this.state.attendees,
        location: details.location,
        date: this.state.date,
        time: this.state.time,
        level: details.level
      })
      .then(ref => {
        console.log("Added document with ID: ", ref.id);
        this.setBookingId(ref.id);
        this.props.navigation.navigate("Home", { bookingid: ref.id });
      });
  }

  componentWillMount() {
    details = this.getRoomDetails();
  }

  render() {
    if (this.state.gotRoom) {
      return (
        <View style={styles.view}>
          <ScrollView>
            <Text style={styles.h1}>Room Details</Text>
            <View style={styles.section}>
              <Text style={styles.h2}>{details.room}</Text>
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

            <View style={styles.section}>
              <Text style={styles.h1}>Booking Form</Text>
              <View style={styles.form}>
                <Text style={styles.h2}>Purpose of booking</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter text here"
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
                  placeholder="Enter value here"
                  keyboardType="numeric"
                  onChangeText={attendees => this.setState({ attendees })}
                />

                <Text style={styles.h2}>Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="DD/MM/YYYY"
                  onChangeText={date => this.setState({ date })}
                />

                <Text style={styles.h2}>Time</Text>
                <TextInput
                  style={styles.input}
                  placeholder="hh:mm - hh:mm"
                  onChangeText={time => this.setState({ time })}
                />

                <Text style={styles.warning}>All fields are required.</Text>

                <Button title="Book" onPress={() => this.makeBooking()} />
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
  warning: {
    color: "red",
    fontSize: 11,
    paddingBottom: 15,
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
