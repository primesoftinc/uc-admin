import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

import UserList from "../screens/UserList";
import HomeScreen from "../screens/HomeScreen";
import CreateBranch from "../screens/CreateBranch";

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    UserList,
    HomeScreen,
    CreateBranch
  })
);
