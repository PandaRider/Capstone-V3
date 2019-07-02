import { createSwitchNavigator, createStackNavigator } from "react-navigation";
import AuthTabs from "../features/auth/Tabs";
import AuthLoadingScreen from "../features/auth/AuthLoading";
import AppStack from "./BottomBar"; // Consider renaming BottomBar or moving navigation over to Nav.js
// import BottomBar from "./BottomBar";

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


// const AppStack = createStackNavigator(
//   {
//     Bar: {
//       screen: BottomBar
//     }
//   },
//   {
//     initialRouteName: "Bar",
//     headerMode: "none"
//   }
// );

// export default createSwitchNavigator(
//   {
//     App: AppStack,
//     Auth: AuthTabs,
//     AuthLoading: AuthLoadingScreen
//   },
//   {
//     initialRouteName: "AuthLoading"
//   }
// );
