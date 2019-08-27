import { createBrowserApp } from "@react-navigation/web";
import { createSwitchNavigator } from "react-navigation";

import UserList from "../screens/UserList";
import HomeScreen from "../screens/HomeScreen";
import DoctorUnavailability from "../screens/DoctorUnavailability";

import AddBranch from "../screens/AddBranch";
import Login from "../screens/Login";
import CheckBox from "../components/CheckBox";
import TimePicker from "../components/TimePicker";
import AddUser from "../screens/AddUser";
import BranchList from "../screens/BranchList";

import AddSlot from "../screens/AddDoctorSlot";

const switchNavigator = createSwitchNavigator(
  {
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Login,
    HomeScreen,
    AddUser,
    DoctorUnavailability,
    BranchList,
    UserList,
    AddBranch,
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
