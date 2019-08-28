import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator
} from "react-native";
import React, { Component } from "react";
import { Button } from "react-native-elements";

const radius1 = {
  yes: {
    borderRadius: 50
  }
};
const sizes = {
  small: {
    width: 200,
    height: 50
  },
  medium: {
    width: 300,
    height: 60
  },
  large: {
    width: 350,
    height: 60
  }
};

export default class ButtonComponent extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { isDisabled: false, istype: false };
  }

  render() {
    const { isDisabled, istype } = this.state;
    const {
      title = "Enter",
      buttonColor,
      iconRight = false,
      style = {},
      textColor,
      textStyle = {},
      width = 325,
      height = 50,
      loading = false,
      iconStyle = {},
      onPress,
      size,
      type = "solid",
      state,
      radius = 15,
      icon
    } = this.props;
    console.log("loading is ", loading);
    return (
      <View>
        {
          <Button
            iconRight={iconRight}
            title={title}
            type={type}
            style={{ fontSize: 20, color: "black" }}
            styleDisabled={{ color: "white" }}
            disabled={isDisabled}
            titleStyle={[textStyle, { color: textColor }]}
            icon={icon}
            iconContainerStyle={iconStyle}
            buttonStyle={[
              styles.container,
              sizes[size],
              { borderRadius: Number(radius) },
              { backgroundColor: buttonColor },
              { height: Number(height) },
              { width: Number(width) },
              style
            ]}
            disabledContainerStyle={{ backgroundColor: "pink" }}
            onPress={onPress}
          />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    height: 45,
    borderRadius: 5,
    width: 200
  },
  ImageIconStyle: {
    padding: 7,
    marginLeft: 15,
    height: 25,
    width: 25,
    resizeMode: "stretch"
  },
  GooglePlusStyle: {
    paddingTop: 20,
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#fff",
    height: 60,
    width: 220,
    borderRadius: 5,
    margin: 5,
    elevation: 10,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.4,
    shadowColor: "black"
  }
});
