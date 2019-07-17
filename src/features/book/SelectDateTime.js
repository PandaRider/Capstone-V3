import React, { Component } from "react";
import { Text, Button, View, StyleSheet } from "react-native";
import DatePicker from "react-native-datepicker";

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

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.h1}>Select Date</Text>
        <DatePicker
          style={styles.picker}
          date={this.state.date} //initial date from state
          mode="date" //The enum of date, datetime and time
          placeholder="select date"
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
        <Text style={styles.h2}>Start time</Text>
        <DatePicker
          style={styles.picker}
          date={this.state.starttime} //initial date from state
          mode="time" //The enum of date, datetime and time
          placeholder="select start time"
          format="hh:mm"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          showIcon={false}
          onDateChange={starttime => {
            this.setState({ starttime: starttime });
          }}
        />
        <Text style={styles.h2}>End time</Text>
        <DatePicker
          style={styles.picker}
          date={this.state.endtime} //initial date from state
          mode="time" //The enum of date, datetime and time
          placeholder="select end time"
          format="hh:mm"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          showIcon={false}
          onDateChange={endtime => {
            this.setState({ endtime: endtime });
          }}
        />
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
    fontSize: 16
  },
  picker: {
    width: 200
  }
});

//https://aboutreact.com/react-native-get-current-date-time/
//https://aboutreact.com/react-native-datepicker/
//https://www.npmjs.com/package/react-native-datepicker
