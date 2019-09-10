import React, { Component } from "react";
import { StyleSheet, AsyncStorage } from "react-native";
import MultiSelect from "react-native-multiple-select";
import { View } from "react-native-web";
import PropTypes from "prop-types";
class DropDown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: false,
      selectedItems: [],
      items: this.props.data
    };
  }

  onSelectedItemsChange = selectedItems => {
    const { updateSelectedData } = this.props;
    this.setState({ selectedItems }, () => updateSelectedData(selectedItems));
  };

  render() {
    const { selectedItems } = this.state;
    return (
      <View>
        <MultiSelect
          styleTextDropdown={styles.styleTextDropdown}
          styleDropdownMenuSubsection={{ borderBottomColor: "#4e38fe" }}
          styleListContainer={{ height: 140, width: 280 }}
          hideTags={false}
          uniqueKey={this.props.uniqueKey}
          displayKey={this.props.displayKey}
          items={this.state.items}
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

DropDown.defaultProps = {
  updateSelectedData: () => {}
};

DropDown.propTypes = {
  updateSelectedData: PropTypes.func
};

export const Specialization = DropDown;
export const Role = DropDown;
