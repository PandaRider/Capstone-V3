import React from "react";
import { View, StyleSheet } from "react-native";
import moment from "moment";
import { Agenda } from "react-native-calendars";
import { Icon, Button, Text } from "native-base";
import { connect } from "react-redux";

import { addRoomBooking } from "./calendarActions";

import "firebase/firestore";
import Firebase from "../../../Firebase";

// import * as firebase from "firebase";
// import 'firebase/firestore'

var db = Firebase.firestore();

const numOfMonthsDisplayed = 2;
// Query all booked rooms
// Display booked rooms [X]
// Fix AddBooking.js to be compatible with data model

class CalendarScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Calendar",
    headerLeft: (
      <Icon
        name="ios-menu"
        style={{ paddingLeft: 10 }}
        onPress={() => navigation.navigate("DrawerOpen")}
      />
    )
  });

  // TODO:
  // Update Firestore names to moment's MM-YY syntax, periodsMonths and periodsDaysHours
  componentDidMount() {
    var currentPeriod = moment().format("MM-YY");
    for(i=numOfMonthsDisplayed;i>0;i--){
      let bookedDaysRef = db.collection("periodsMonths").doc(currentPeriod).collection("periodsDaysHours");
      let bookedDays = bookedDaysRef.get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            let currentBooking = doc.data()
            let calendarPeriod = moment(currentBooking.start.toDate()).format("YYYY-MM-DD")
            // this.state.items[calendarPeriod] = []
            // for (let j = 0; j < 3; j++) {
            //   this.state.items[calendarPeriod].push({
            //     name: "Item for " + calendarPeriod,
            //     height: Math.max(50, Math.floor(Math.random() * 150))
            //   });
            // }
            console.log(calendarPeriod)
            console.log(doc.id, "=>", doc.data());
          });
        })
        .catch(err => {
          console.log("Error getting documents", err);
        });  
      let addPeriod = moment(currentPeriod).add(1,'month');
      currentPeriod = addPeriod.format("MM-YY")
    }
    

    // let myRef = db.collection("periods").doc("August'19").collection("periodsDays").doc("rYje6lv1NeypxLdlpbDn");
    // myRef.get()
    //   .then(doc =>
    //     console.log(moment(doc.data().start.toDate()).format("DD-MM-YYYY-hh-mm"))
    //   );

  }
  // TODO:
  // Play around with flex values! See which one moves the calendar length view!

  constructor(props) {
    super(props);
    this.state = {
      items: {
        "2017-05-16": [{ text: "item 1 - any js object" }],
        "2017-05-17": [{ text: "item 2 - any js object" }]
      }
    };
  }

  render() {
    return (
      <Agenda
        items={this.state.items}
        // loadItemsForMonth={this.loadItems.bind(this)}
        selected={"2017-05-16"}
        pastScrollRange={numOfMonthsDisplayed}
        renderItem={this.renderItem.bind(this)}
        renderEmptyDate={this.renderEmptyDate.bind(this)}
        rowHasChanged={this.rowHasChanged.bind(this)}
        // markingType={'period'}
        // markedDates={{
        //    '2017-05-08': {textColor: '#666'},
        //    '2017-05-09': {textColor: '#666'},
        //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
        //    '2017-05-21': {startingDay: true, color: 'blue'},
        //    '2017-05-22': {endingDay: true, color: 'gray'},
        //    '2017-05-24': {startingDay: true, color: 'gray'},
        //    '2017-05-25': {color: 'gray'},
        //    '2017-05-26': {endingDay: true, color: 'gray'}}}
        // monthFormat={'yyyy'}
        // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
        //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
        theme={{
          arrowColor: "white",
          "stylesheet.calendar.header": {
            week: {
              marginTop: 5,
              flexDirection: "row",
              justifyContent: "space-between"
            }
          },
          agendaKnobColor: "green"
        }}
      />
    );
  }

  loadItems(day) {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
          const numItems = Math.floor(Math.random() * 5);
          for (let j = 0; j < numItems; j++) {
            this.state.items[strTime].push({
              name: "Item for " + strTime,
              height: Math.max(50, Math.floor(Math.random() * 150))
            });
          }
        }
      }
      console.log(this.state.items);
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {
        newItems[key] = this.state.items[key];
      });
      this.setState({
        items: newItems
      });
    }, 1000);
    // console.log(`Load Items for ${day.year}-${day.month}`);
  }

  renderItem(item) {
    return (
      <View style={[styles.item, { height: item.height }]}>
        {/* <Text onPress={() => this.props.dispatchAddRoomBooking('basic_room', '0700', 'Alice', {'detail1': 'abc', 'detail2': '123'})} >{item.name}</Text> */}
        {/* <Text onPress={() => this.props.navigation.navigate("Room")} >{item.name}</Text> */}
        <Button light onPress={() => this.props.navigation.navigate("")}>
          <Text>Test</Text>
        </Button>
      </View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split("T")[0];
  }
}

const mapDispatchToProps = {
  dispatchAddRoomBooking: (roomId, timeSlot, user, bookingDetails) =>
    addRoomBooking(roomId, timeSlot, user, bookingDetails)
};

const mapStateToProps = state => ({
  booking: state.booking
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarScreen);

const styles = StyleSheet.create({
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10, // impt
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  }
});
