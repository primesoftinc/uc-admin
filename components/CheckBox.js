import React, { Component } from "react";
import { StyleSheet } from "react-native";
import MultiSelect from "react-native-multiple-select";
import { View } from "react-native-web";

export default class CheckBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedItems: []
    };

    this.items = [
      {
        id: "0",
        name: "Monday"
      },
      {
        id: "1",
        name: "Tuesday"
      },
      {
        id: "2",
        name: "Wednesday"
      },
      {
        id: "3",
        name: "Thursday"
      },
      {
        id: "4",
        name: "Friday"
      },
      {
        id: "5",
        name: "Saturday"
      },
      {
        id: "6",
        name: "Sunday "
      }
    ];
  }
  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
    console.log(this.state.selectedItems);
  };
  render() {
    const { selectedItems } = this.state;
    return (
      <View style={{ height: 140, width: 280 }}>
        <MultiSelect
          styleTextDropdown={styles.styleTextDropdown}
          styleDropdownMenuSubsection={{ borderBottomColor: "#4e38fe" }}
          styleListContainer={{ height: 140, width: 280 }}
          hideTags={false}
          items={this.items}
          uniqueKey="id"
          ref={component => {
            this.multiSelect = component;
          }}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={selectedItems}
          selectText="Select"
          styleTextDropdownSelected={{ color: "#4e38fe", fontWeight: "normal" }}
          styleDropdownMenu={{ paddingLeft: 10, paddingRight: 10, height: 100 }}
          searchInputPlaceholderText="Search"
          searchInputStyle={{ width: 250 }}
          onChangeInput={component => {
            this.multiSelect = component;
          }}
          tagRemoveIconColor="#4e38fe"
          tagBorderColor="#4e38fe"
          tagTextColor="#4e38fe"
          selectedItemTextColor="#4e38fe"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          submitButtonColor="#4e38fe"
          submitButtonText="Submit"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  styleTextDropdown: {
    color: "#CCC",
    fontSize: 16,
    fontWeight: "normal"
  }
});
