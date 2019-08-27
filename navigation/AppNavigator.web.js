import { createBrowserApp } from "@react-navigation/web";
import { createSwitchNavigator } from "react-navigation";

import UserList from "../components/UserList";
import HomeScreen from "../components/HomeScreen";
import DoctorUnavailability from "../components/DoctorUnavailability";

import AddBranch from "../components/AddBranch";
import Login from "../components/Login";
import CheckBox from "../components/CheckBox";
import TimePicker from "../components/TimePicker";
import AddUser from "../components/AddUser";
import BranchList from "../components/BranchList";

import AddSlot from "../components/AddDoctorSlot";

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
