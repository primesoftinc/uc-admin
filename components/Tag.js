import React, { useState } from "react";
import { TouchableWithoutFeedback, View, Text, Alert } from "react-native";
import { Icon } from "react-native-elements";

const tagColor = "#EAB543";

export default function Tag(props) {
  const { value, onClick, ToggleColor, bgColor, isDisabled } = props;

  return (
    <View style={{ margin: 2 }}>
      <TouchableWithoutFeedback
        style={{ margin: 10 }}
        onPress={onClick}
        disabled={isDisabled}
      >
        <View
          style={{
            borderRadius: 20,
            flexDirection: "row",
            borderColor: ToggleColor,
            borderWidth: 2,
            width: 65,
            height: 30,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white"
          }}
        >
          <Text
            style={{
              fontSize: 11,
              color: ToggleColor
            }}
          >
            {value}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
