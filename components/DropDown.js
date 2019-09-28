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
      dummy: this.props.selectedItems,
      // selectedItems: this.props.selectedItems,
      selectedItems: [],
      items: this.props.data
    };
  }

  componentDidMount() {
    console.log("sample", this.props);
    const { ...field } = this.props;
    const { ...props } = this.props;
    console.log("propsOfRoles", { ...props });
    console.log("filedPropps:", { ...field });
    const { selectedItems } = this.props;
    if (selectedItems.length > 0) {
      this.setState({
        selectedItems
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { selectedItems } = prevProps;
    const { selectedItems: loSelectedItems } = this.props;
    if (selectedItems.length !== loSelectedItems.length) {
      this.updateSelectedItems();
    }
  }

  updateSelectedItems = () => {
    const { selectedItems } = this.props;
    this.setState({
      selectedItems
    });
  };

  onSelectedItemsChange = selectedItems => {
    console.log("form poros", this.props);
    const { updateSelectedData } = this.props;
    const { onChangeFunctionName } = this.props;
    // this.props.form.handleChange("user.userRoles", selectedItems);
    // this.props.form.setFieldValue();
    //   console.log("this.props", this.props);
    //this.setState({ selectedItems }, () =>
    // this.setState({ selectedItems });
    // updateSelectedData(selectedItems);
    // this.props.form.setFieldValue("user.userRoles", selectedItems);
    onChangeFunctionName(selectedItems);

    // this.setState({ selectedItems }, () => updateSelectedData(selectedItems));
    //};

    //onSelectedItemsChange = selectedItems => {
    //console.log("selectedItems", selectedItems);
    //const { updateSelectedData } = this.props;
    //this.setState({ selectedItems }, () => updateSelectedData(selectedItems));
    //this.setState({ selectedItems });
    // this.props.form.setFieldValue("userRoles", this.state.selectedItems);
  };

  render() {
    console.log("sample", this.props);
    const { selectedItems, dummy } = this.state;
    // console.log("selecteditemsdropdown", selectedItems);
    // console.log("dummy", dummy);
    // const selectedItemIds = selectedItems.map(item => item.role.id);
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
          // onSelectedItemsChange={this.props.form.handleChange("user.userRoles")}
          //onSelectedItemsChange={}
          // selectedItems={_.get(
          //  this.props.form,
          //  "values.user.doctor[0].doctorSpecializations",
          //   []
          // )}
          // selectedItems={_.get(this.props.values, this.props.selectedItems, [])}
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
  updateSelectedData: () => {},
  selectedItems: []
};

DropDown.propTypes = {
  updateSelectedData: PropTypes.func,
  selectedItems: PropTypes.instanceOf(Array)
};

export const Specialization = DropDown;
export const Role = DropDown;
