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
      checkAttendees: true
    };
    // console.log("state is: ", this.state)
  }

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

  async makeBooking() {
    let [dday, dmonth, dyear] = this.state.date.split("-");
    let startTime = this.props.navigation.getParam("start")
    let endTime = this.props.navigation.getParam("end")
    // startTime = startTime.slice(0, -3); // WARNING: manipulating string
    // endTime = endTime.slice(0, -3);
    // let sTime = parseInt(startTime);
    // let eTime = parseInt(endTime);

    let diff = endTime - startTime;
    timeslots = [];
    for (let d = 0; d < diff; d++) {
      let inputStr = String(startTime + d);
      timeslots.push(inputStr + "00");
    }

    // db.collection("fakebookings")
    //   .add({
    //     room: details.room,
    //     purpose: this.state.purpose,
    //     attendees: this.state.attendees,
    //     location: details.location,
    //     date: this.state.date,
    //     time: this.state.time,
    //     level: details.level
    //   })
    //   .then(ref => {
    //     this.setBookingId(ref.id);
    //     this.props.navigation.navigate("Home", { bookingid: ref.id });
    //   });

    // Purpose: Check for clashes. Query same dateTime slots first.
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
      await Promise.all(dbPromises).then(snapshotArr => {
        snapshotArr.forEach(snapshot => {
          snapshot.forEach(doc => {
            if (doc.exists) hasClash = true;
          });
        });
      });
      console.log("Checking for clash...", hasClash);
      
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
        console.log(addMe);
        
        db.collection("userBookings4")
          .add(addMe)
          .then(ref => this.props.navigation.navigate("Home", { bookingid: ref.id, "from_AddBooking": "transit from AddBooking"}));
      } else {
        this.props.navigation.navigate("SelectDateTime")
        // 
      }
      
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

                <Button
                  title="Book"
                  color="#EF7568"
                  onPress={() => {
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
