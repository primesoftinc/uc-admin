import { createBrowserApp } from "@react-navigation/web";
import { createSwitchNavigator } from "react-navigation";

import UserList from "../screens/UserList";
import DatePicker from "../screens/DatePicker";
import HomeScreen from "../screens/HomeScreen";
import DoctorUnavailability from "../screens/DoctorUnavailability";
import AppoinmentsByDoctor from "../screens/AppoinmentsByDoctor";
import CreateBranch from "../screens/CreateBranch";
import Login from "../screens/Login";
import EditForm from "../screens/EditForm";
import BranchList from "../screens/BranchList";
import CreateRole from "../screens/CreateRole";
import RoleList from "../screens/RoleList";
import AppointmentList from "../screens/AppointmentList";
import BranchInfo from "../screens/BranchInfo";
import AddNotes from "../screens/AddNotes";

import CreatePrivilege from "../screens/CreatePrivilege";
import PrivilegeList from "../screens/PrivilegeList";
import CreateDoctorSlot from "../screens/CreateDoctorSlot";
import DoctorList from "../screens/DoctorList";
import FormikCreateUser from "../screens/FormikCreateUser";
import UnavailabilityList from "../screens/UnavailabilityList";
const switchNavigator = createSwitchNavigator(
  {
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Login,
    CreatePrivilege,
    PrivilegeList,
    DatePicker,
    HomeScreen,
    BranchInfo,
    DoctorList,
    CreateRole,
    RoleList,
    AppointmentList,
    DoctorUnavailability,
    BranchList,
    UserList,
    AppoinmentsByDoctor,
    CreateBranch,
    EditForm,
    CreateDoctorSlot,
    AddNotes,
    FormikCreateUser,
    UnavailabilityList
  },
  {
    initialRouteName: "Login"
  }
);
switchNavigator.path = "";

export default createBrowserApp(switchNavigator);
