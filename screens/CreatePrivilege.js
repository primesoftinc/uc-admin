import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
const CREATE_PRIVILEGE = gql`
  mutation savePrivilege(
    $privilegeCode: String
    $category: String
    $section: String
    $type: String
  ) {
    savePrivilege(
      privilege: {
        privilegeCode: $privilegeCode
        category: $category
        section: $section
        type: $type
      }
    ) {
      privilegeCode
      category
      section
      type
    }
  }
`;
export default class CreatePrivilege extends Component {
  constructor(props) {
    super(props);
    this.state = {
      privilegeCode: "",
      category: "",
      section: "",
      type: ""
    };
  }

  render() {
    return (
      <View>
        <Mutation mutation={CREATE_PRIVILEGE}>
          {saveData => (
            <View>
              <View
                style={{
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ color: "#6699ff", fontSize: 25 }}>
                  Create Privilege
                </Text>
              </View>
              <View
                style={{
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <TextInput
                  label="Privilege Code"
                  placeholder="Privilege Code"
                  value={this.state.privilegeCode}
                  onChangeText={text => this.setState({ privilegeCode: text })}
                  style={styles.textInputContainerStyle}
                />
              </View>
              <View
                style={{
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <TextInput
                  label="Category"
                  textContentType="Category"
                  value={this.state.category}
                  onChangeText={text => this.setState({ category: text })}
                  placeholder="category"
                  style={styles.textInputContainerStyle}
                />
              </View>

              <View
                style={{
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <TextInput
                  label="Section"
                  value={this.state.section}
                  onChangeText={text => this.setState({ section: text })}
                  placeholder="Section"
                  style={styles.textInputContainerStyle}
                />
              </View>
              <View
                style={{
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <TextInput
                  label="Type"
                  value={this.state.type}
                  onChangeText={text => this.setState({ type: text })}
                  placeholder="Type"
                  style={styles.textInputContainerStyle}
                />
              </View>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Button
                  containerStyle={{ width: 100 }}
                  title="save"
                  onPress={() => {
                    console.log("fhgk");
                    saveData({
                      variables: {
                        privilegeCode: this.state.privilegeCode,
                        category: this.state.category,
                        section: this.state.section,
                        type: this.state.type
                      }
                    }).then(() => {
                      return <Text>Sucess</Text>;
                    });
                    this.setState({
                      privilegeCode: "",
                      category: "",
                      section: "",
                      type: ""
                    });
                  }}
                />
              </View>
            </View>
          )}
        </Mutation>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  textInputContainerStyle: {
    borderBottomWidth: 1,
    borderBottomColor: "#4e38fe",
    width: 400,
    padding: 10
  }
});
