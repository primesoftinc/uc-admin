import { createBrowserApp } from "@react-navigation/web";
import { createSwitchNavigator } from "react-navigation";

import UserList from "../screens/UserList";
import HomeScreen from "../screens/HomeScreen";
import DoctorUnavailability from "../screens/DoctorUnavailability";

import CreateBranch from "../screens/CreateBranch";
import Login from "../screens/Login";
import CheckBox from "../components/CheckBox";
import TimePicker from "../components/TimePicker";
import CreateUser from "../screens/CreateUser";
import BranchList from "../screens/BranchList";
import AppointmentList from "../screens/AppointmentList";
import CreatePrivilege from "../screens/CreatePrivilege";
import PrivilegeList from "../screens/PrivilegeList";
import AddSlot from "../screens/CreateDoctorSlot";

const switchNavigator = createSwitchNavigator(
  {
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Login,
    CreatePrivilege,
    PrivilegeList,
    AppointmentList,
    HomeScreen,
    CreateUser,
    DoctorUnavailability,
    BranchList,
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
