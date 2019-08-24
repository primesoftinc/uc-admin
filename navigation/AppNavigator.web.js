import { createBrowserApp } from "@react-navigation/web";
import { createSwitchNavigator } from "react-navigation";

import UserList from "../components/UserList";
import HomeScreen from "../components/HomeScreen";

import CreateBranch from "../components/CreateBranch";
import Login from "../components/Login";
import CheckBox from "../components/CheckBox";
import TimePicker from "../components/TimePicker";

import AddSlot from "../components/AddDoctorSlot";

const switchNavigator = createSwitchNavigator(
  {
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Login,
    HomeScreen,
    UserList,
    CreateBranch,
    CheckBox,
    TimePicker,
    AddSlot
  },
  {
    initialRouteName: "Login"
  }
);
switchNavigator.path = "";

export default createBrowserApp(switchNavigator);
