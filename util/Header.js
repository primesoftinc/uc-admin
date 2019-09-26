import React from "react";
import { View } from "react-native";
import { Header, Icon } from "react-native-elements";
export default class HeaderComponent extends React.Component {
  render() {
    return (
      <Header
        centerComponent={{ text: "Home", style: { color: "#fff" } }}
        rightComponent={{ icon: "home", color: "#fff" }}
        leftComponent={
          <Icon
            name="arrow-back"
            color="#fff"
            onPress={() => {
              console.log("adsfgw");
              window.history.go(-1);
            }}
          />
        }
      />
    );
  }
}
