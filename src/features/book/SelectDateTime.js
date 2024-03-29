/**
 * SelectDateTime.js is for the user to select the booking date and time
 * of the new booking.
 */

import React, { Component } from "react";
import { Text, Button, View, StyleSheet, Picker } from "react-native";
import DatePicker from "react-native-datepicker";

// get and set current datetime values
var day = new Date().getDate();
var month = new Date().getMonth() + 1;
var year = new Date().getFullYear();
var datetoday = day + "-" + month + "-" + year;
var hours = new Date().getHours();
var timestart = hours;
var timeend = hours + 1;

export default class DateTimePicker extends Component {
  static navigationOptions = {
    title: "Select Date and Time",
    headerTintColor: "#EF7568"
  };

  constructor(props) {
    super(props);

    // set state variables
    this.state = { date: datetoday, starttime: timestart, endtime: timeend };
  }

  componentDidUpdate(prevProps) {
    if (prevProps != this.props) {
    }
  }

  // generate range of available time selections
  getTimePickerItems(tval, start) {
    var tvals = [];

    timelimit = 25;
    if (start) {
      timelimit = 24;
    }

    if (this.state.date != datetoday) {
      if (start) {
        tval = 1;
      }
    }

    for (i = 0; i < timelimit - tval; i++) {
      if (i + tval < timelimit) {
        tvals.push(i + tval);
      }
    }
    return tvals.map((t, i) => (
      <Picker.Item key={i} label={t + ":00"} value={t} />
    ));
  }

  render() {
    return (
      <View style={styles.container}>
        {/* Date selection component */}
        <Text style={styles.h1}>Select Date</Text>
        <DatePicker
          style={styles.picker}
          date={this.state.date}
          mode="date"
          placeholder="Select date"
          format="DD-MM-YYYY"
          minDate={datetoday}
          maxDate="01-01-2020"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          showIcon={false}
          onDateChange={date => {
            this.setState({ date: date });
          }}
        />

        {/* Time selection components */}
        <Text style={styles.h1}>Select Time</Text>
        <View style={styles.timeinput}>
          <Text style={styles.h2}>Start time</Text>
          <Picker
            selectedValue={this.state.starttime}
            style={{ height: 30, width: 150 }}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ starttime: itemValue })
            }
          >
            {this.getTimePickerItems(timestart, true)}
          </Picker>
        </View>

        <View style={styles.timeinput}>
          <Text style={styles.h2}> End time </Text>
          <Picker
            selectedValue={this.state.endtime}
            style={{ height: 30, width: 150 }}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ endtime: itemValue })
            }
          >
            {this.getTimePickerItems(this.state.starttime + 1, false)}
          </Picker>
        </View>

        <View style={styles.btn}>
          {/* Button to make datetime selection */}
          <Button
            title={"Confirm"}
            color="#EF7568"
            onPress={() => {
              let [dday, dmonth, dyear] = this.state.date.split("-");
              dday = parseInt(dday);
              dmonth = parseInt(dmonth);
              dyear = parseInt(dyear);

              this.props.navigation.navigate("SelectRoom", {
                date: this.state.date,
                start: this.state.starttime,
                end: this.state.endtime
              });
            }}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  btn: {
    paddingTop: 50
  },
  h1: {
    color: "#EF7568",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 30,
    paddingBottom: 5
  },
  h2: {
    color: "#EF7568",
    fontSize: 16,
    paddingHorizontal: 20
  },
  picker: {
    width: 200
  },
  timeinput: {
    flexDirection: "row",
    padding: 5
  }
});
