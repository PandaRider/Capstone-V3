/**
 * Nav.js sets up the navigation between screens.
 */

import { createSwitchNavigator, createStackNavigator } from "react-navigation";
import AuthTabs from "../features/auth/Tabs";
import AuthLoadingScreen from "../features/auth/AuthLoading";
import BottomBar from "./BottomBar";

const AppStack = createStackNavigator(
  {
    Bar: {
      screen: BottomBar
    }
  },
  {
    initialRouteName: "Bar",
    headerMode: "none"
  }
);

export default createSwitchNavigator(
  {
    App: AppStack,
    Auth: AuthTabs,
    AuthLoading: AuthLoadingScreen
  },
  {
    initialRouteName: "AuthLoading"
  }
);
