import React, { Component } from "react";
import { StyleSheet, AsyncStorage, View } from "react-native";
import MultiSelect from "react-native-multiple-select";
import PropTypes from "prop-types";
export default class MultipleSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedItems: this.props.selectedItems,
      //selectedItems: [],
      items: this.props.data
    };

    console.log("constructor", this.props.selectedItems);
  }
  componentDidMount() {
    console.log("sample", this.props);
    const { ...field } = this.props;
    const { ...props } = this.props;
    console.log("propsOfRoles", { ...props });
    console.log("filedPropps:", { ...field });
    const { selectedItems } = this.props;
    console.log("length", this.props.selectedItems);
    if (selectedItems.length > 0) {
      console.log("if", selectedItems);
      this.setState({
        selectedItems
      });
    }
  }
  updateSelectedItems = () => {
    const { selectedItems } = this.props;
    this.setState({
      selectedItems
    });
  };
  componentDidUpdate(prevProps) {
    const { selectedItems } = prevProps;
    const { selectedItems: loSelectedItems } = this.props;
    if (selectedItems.length !== loSelectedItems.length) {
      this.updateSelectedItems();
    }
  }

  onSelectedItemsChange = selectedItems => {
    const { form, field } = this.props;
    this.setState({ selectedItems });

    form.setFieldValue(field.name, selectedItems);
  };

  render() {
    const { selectedItems, items } = this.state;
    const { uniqueKey, displayKey } = this.props;

    return (
      <View>
        <MultiSelect
          selectedItems={selectedItems}
          onSelectedItemsChange={this.onSelectedItemsChange}
          uniqueKey={uniqueKey}
          displayKey={displayKey}
          styleTextDropdown={styles.styleTextDropdown}
          styleDropdownMenuSubsection={{ borderBottomColor: "#4e38fe" }}
          styleListContainer={{ height: 140, width: 280 }}
          hideTags={false}
          items={items}
          ref={component => {
            this.multiSelect = component;
          }}
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
MultiSelect.defaultProps = {
  updateSelectedData: () => {},
  selectedItems: []
};

MultiSelect.propTypes = {
  updateSelectedData: PropTypes.func,
  selectedItems: PropTypes.instanceOf(Array)
};
