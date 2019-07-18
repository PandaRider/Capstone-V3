import React, { Component } from "react";
import { Text, Button, View, StyleSheet } from "react-native";
import DatePicker from "react-native-datepicker";
import { throwStatement } from "@babel/types";

var day = new Date().getDate(); //Current Date
var month = new Date().getMonth() + 1; //Current Month
var year = new Date().getFullYear(); //Current Year
var datetoday = day + "-" + month + "-" + year;

var hours = new Date().getHours(); //Current Hours
var timestart = hours + ":00";
var timeend = hours + 1 + ":00";

export default class DateTimePicker extends Component {
  constructor(props) {
    super(props);
    this.state = { date: datetoday, starttime: timestart, endtime: timeend };
  }

  parser() {
    // to parse date and time before it is added to firebase
    var [dday, dmonth, dyear] = this.state.date.split("-");
    var dstart = this.state.starttime.split(":");
    var dend = this.state.endtime.split(":");
    console.log(this.state.date, this.state.starttime, this.state.endtime);
    console.log(parseInt(dday), parseInt(dmonth), parseInt(dyear));
    console.log(dstart.join(""));
    console.log(dend.join(""));

    dday = parseInt(dday);
    dmonth = parseInt(dmonth);
    dyear = parseInt(dyear);
    dstart = dstart.join("");
    dend = dend.join("");

    return dday, dmonth, dyear, dstart, dend;
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.h1}>Select Date</Text>
        <DatePicker
          style={styles.picker}
          date={this.state.date} //initial date from state
          mode="date" //The enum of date, datetime and time
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
        <Text style={styles.h1}>Select Duration</Text>
        <View style={styles.timeinput}>
          <Text style={styles.h2}>Start time</Text>
          <DatePicker
            style={styles.picker}
            date={this.state.starttime} //initial date from state
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
            date={this.state.endtime} //initial date from state
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
        <View style={styles.btn}>
          <Button
            title={"Confirm"}
            onPress={() => this.props.navigation.navigate("SelectRoom")}
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
    color: "#008BE3",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 30,
    paddingBottom: 5
  },
  h2: {
    color: "#008BE3",
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

//https://aboutreact.com/react-native-get-current-date-time/
//https://aboutreact.com/react-native-datepicker/
//https://www.npmjs.com/package/react-native-datepicker
