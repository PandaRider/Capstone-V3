import React from "react";
import { createStackNavigator } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import ChatScreen from "../features/chat/ChatScreen";
import UserList from "../features/chat/UserList";
import HomeScreen from "../navigation/HomeScreen";
import NotificationScreen from "../features/notifications/notifications";
import ScannerScreen from "../features/qr/Scanner";
import SelectDateTime from "../features/book/SelectDateTime";
import SelectRoomScreen from "../features/book/SelectRoom";
import AddBookingScreen from "../features/book/AddBooking";
import ViewBookingScreen from "../features/book/ViewBooking";
import ModifyBookingScreen from "../features/book/ModifyBooking";
import CurrentBookingScreen from "../features/book/CurrentBooking";
import ProfileScreen from "../features/profile/ProfileScreen";
import ReportScreen from '../features/report/Report';

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
      tabBarIcon: ({ focused, tintColor }) => (
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
    ViewBooking: ViewBookingScreen,
    ModifyBooking: ModifyBookingScreen,
    CurrentBooking: CurrentBookingScreen,
    Scanner: ScannerScreen
  },
  {
    navigationOptions: {
      tabBarIcon: ({ focused, tintColor }) => (
        <Icon style={[{ color: tintColor }]} size={25} name={"ios-home"} />
      ),
      activeTintColor: "white"
    }
  }
);

export default createMaterialBottomTabNavigator(
  {
    Profile: ProfileScreen,
    Home: BookingStack,
    Chats: ChatStack,
    // Notifs: NotificationScreen,
    Report: ReportScreen
  },
  {
    initialRouteName: "Home",
    shifting: true,
    barStyle: { backgroundColor: "#008BE3" }
  }
);
