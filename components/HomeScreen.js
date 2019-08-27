import React, { Component } from "react";
import { View, Text } from "react-native-web";
import { Button } from "react-native-elements";
export default class FormComponent extends Component {
  render() {
    return (
      <View>
        <Text style={{ fontSize: 30, alignSelf: "center" }}>
          {" "}
          {this.props.navigation.state.params.name}
        </Text>
        <Button
          title="UserList"
          onPress={() => this.props.navigation.navigate("UserList")}
        />
        <Button
          title="AddUser"
          onPress={() => this.props.navigation.navigate("AddUser")}
        />
        <Button
          title="AddBranch"
          onPress={() => this.props.navigation.navigate("AddBranch")}
        />
        <Button
          title="BranchList"
          onPress={() => this.props.navigation.navigate("BranchList")}
        />
        <Button
          title="AddDoctorSlot"
          onPress={() => this.props.navigation.navigate("AddSlot")}
        />
        <Button
          title="Checkbox"
          onPress={() => this.props.navigation.navigate("CheckBox")}
        />
        <Button
          title="TimePicker"
          onPress={() => this.props.navigation.navigate("TimePicker")}
        />
      </View>
    );
  }
}
