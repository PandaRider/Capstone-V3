import React from "react";
import { createStackNavigator } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import ChatScreen from "../features/chat/ChatScreen";
import UserList from "../features/chat/UserList";
import HomeScreen from "../navigation/HomeScreen";
import NotificationScreen from "../features/notifications/notifications";
import ScannerScreen from "../features/qr/Scanner";
import SelectRoomScreen from "../features/book/SelectRoom";
import AddBookingScreen from "../features/book/AddBooking";
import ViewBookingScreen from "../features/book/ViewBooking";
import ModifyBookingScreen from "../features/book/ModifyBooking";
import CurrentBookingScreen from "../features/book/CurrentBooking";
import CalendarScreen from "../features/calendar/CalendarScreen";

class ProfileScreen extends React.Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon style={[{ color: tintColor }]} size={25} name={"ios-person"} />
    ),
    activeTintColor: "white"
  };
  render() {
    return null;
  }
}

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
    // Profile: ProfileScreen,
    Home: BookingStack,
    Calendar: CalendarScreen,
    Chats: ChatStack,
    Notifs: NotificationScreen
  },
  {
    initialRouteName: "Home",
    shifting: true,
    barStyle: { backgroundColor: "#008BE3" }
  }
);