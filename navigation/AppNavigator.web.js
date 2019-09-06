import { createBrowserApp } from "@react-navigation/web";
import { createSwitchNavigator } from "react-navigation";

import UserList from "../screens/UserList";
import HomeScreen from "../screens/HomeScreen";
import DoctorUnavailability from "../screens/DoctorUnavailability";

import CreateBranch from "../screens/CreateBranch";
import Login from "../screens/Login";
import EditForm from "../screens/EditForm";

import CreateUser from "../screens/CreateUser";
import BranchList from "../screens/BranchList";
import CreateRole from "../screens/CreateRole";
import RoleList from "../screens/RoleList";

// import AppointmentList from "../screens/AppointmentList";
import CreatePrivilege from "../screens/CreatePrivilege";
import PrivilegeList from "../screens/PrivilegeList";
import CreateDoctorSlot from "../screens/CreateDoctorSlot";
import DoctorList from "../screens/DoctorList";

const switchNavigator = createSwitchNavigator(
  {
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Login,
    CreatePrivilege,
    PrivilegeList,
    // AppointmentList,
    HomeScreen,
    DoctorList,
    CreateUser,
    CreateRole,
    RoleList,
    DoctorUnavailability,
    BranchList,
    UserList,
    CreateBranch,
    EditForm,
    CreateDoctorSlot
  },
  {
    initialRouteName: "Login"
  }
);
switchNavigator.path = "";

export default createBrowserApp(switchNavigator);
