/**
 * BottomBar.js sets up the navigation between screens.
 */

import React from "react";
import { createStackNavigator } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import ChatScreen from "../features/chat/ChatScreen";
import UserList from "../features/chat/UserList";
import HomeScreen from "../navigation/HomeScreen";
import ScannerScreen from "../features/qr/Scanner";
import SelectDateTime from "../features/book/SelectDateTime";
import SelectRoomScreen from "../features/book/SelectRoom";
import AddBookingScreen from "../features/book/AddBooking";
import UpcomingBookingScreen from "../features/book/UpcomingBooking";
import ModifyBookingScreen from "../features/book/ModifyBooking";
import CurrentBookingScreen from "../features/book/CurrentBooking";
import ProfileScreen from "../features/profile/ProfileScreen";
import ReportScreen from "../features/report/Report";

const ChatStack = createStackNavigator(
  {
    Users: {
      screen: UserList
    },
    Chat: {
      screen: ChatScreen
    }
  },
  {
    headerMode: "none",
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <Icon
          style={[{ color: tintColor }]}
          size={25}
          name={"ios-chatbubbles"}
        />
      ),
      activeTintColor: "white"
    }
  }
);

const BookingStack = createStackNavigator(
  {
    Home: HomeScreen,
    SelectDateTime: SelectDateTime,
    SelectRoom: SelectRoomScreen,
    AddBooking: AddBookingScreen,
    UpcomingBooking: UpcomingBookingScreen,
    ModifyBooking: ModifyBookingScreen,
    CurrentBooking: CurrentBookingScreen,
    Scanner: ScannerScreen
  },
  {
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <Icon style={[{ color: tintColor }]} size={25} name={"ios-home"} />
      ),
      activeTintColor: "white"
    }
  }
);

export default createMaterialBottomTabNavigator(
  {
    Home: BookingStack,
    Profile: ProfileScreen,
    Chats: ChatStack,
    Report: ReportScreen
  },
  {
    initialRouteName: "Home",
    shifting: true,
    barStyle: { backgroundColor: "#EF7568" },
    backBehavior: "initialRoute"
  }
);
