import React, { Component } from "react";
import { View, Text } from "react-native-web";
import { Button } from "react-native-elements";
export default class FormComponent extends Component {
  render() {
    return (
      <View>
        <Text>hkdj</Text>
        <Button
          title="UserList"
          onPress={() => this.props.navigation.navigate("UserList")}
        />
        <Button
          title="AddBranch"
          onPress={() => this.props.navigation.navigate("CreateBranch")}
        />
        <Button
          title="time"
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
