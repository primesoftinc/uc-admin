import {
  createStackNavigator,
  createMaterialTopTabNavigator
} from "react-navigation";
import React, { Component } from "react";
//import Navigator in our project

import DatePicker from "./DatePicker";
import TodayList from "./TodayList";

//Making TabNavigator which will be called in App StackNavigator
//we can directly export the TabNavigator also but header will not be visible
//as header comes only when we put anything into StackNavigator and then export
const TabScreen = createMaterialTopTabNavigator(
  {
    Today: { screen: props => <TodayList {...props} date="2019:06:23" /> },
    Tomorrow: { screen: props => <TodayList {...props} date="2019:06:24" /> },
    datePick: { screen: DatePicker }
  },
  {
    tabBarPosition: "top",
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: "#ffffff",
      inactiveTintColor: "#F8F8F8",
      style: {
        backgroundColor: "#6600FF"
      },
      labelStyle: {
        textAlign: "center"
      },
      indicatorStyle: {
        borderBottomColor: "#ffffff",
        borderBottomWidth: 2
      }
    }
  }
);

//making a StackNavigator to export as default
const AppointmentList = createStackNavigator(
  {
    TabScreen: {
      screen: TabScreen
    }
  },
  {
    headerMode: "none",
    navigationOptions: {
      headerVisible: false
    }
  }
);
//For React Navigation Version 2+
export default AppointmentList;
