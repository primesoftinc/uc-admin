import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
const CREATE_BRANCH = gql`
  mutation saveBranch(
    $branchName: String
    $email: String
    $code: String
    $landPhone: String
    $contact: String
    $mobile: String
  ) {
    saveBranch(
      branch: {
        branchName: $branchName
        email: $email
        code: $code
        landPhone: $landPhone
        contact: $contact
        mobile: $mobile
      }
    ) {
      id
    }
  }
`;
export default class CreateBranch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      branchName: "",
      email: "",
      code: "",
      landPhone: "",
      contact: "",
      mobile: ""
    };
  }

  render() {
    return (
      <View>
        <Mutation mutation={CREATE_BRANCH}>
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
                  Create Branch
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
                  label="Branch Name"
                  placeholder="Branch Name"
                  value={this.state.branchName}
                  onChangeText={text => this.setState({ branchName: text })}
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
                  label="Email"
                  textContentType="emailAddress"
                  value={this.state.email}
                  onChangeText={text => this.setState({ email: text })}
                  placeholder="Email"
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
                  label="Code"
                  value={this.state.code}
                  onChangeText={text => this.setState({ code: text })}
                  placeholder="Code"
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
                  label="Land Phone"
                  value={this.state.landPhone}
                  onChangeText={text => this.setState({ landPhone: text })}
                  placeholder="Land Phone"
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
                  label="Contact"
                  value={this.state.contact}
                  onChangeText={text => this.setState({ contact: text })}
                  placeholder="Contact"
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
                  label="Mobile"
                  value={this.state.mobile}
                  onChangeText={text => this.setState({ mobile: text })}
                  placeholder="Mobile"
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
                        branchName: this.state.branchName,
                        code: this.state.code,
                        contact: this.state.contact,
                        landPhone: this.state.landPhone,
                        email: this.state.email,
                        mobile: this.state.mobile
                      }
                    });
                    this.setState({
                      email: "",
                      branchName: "",
                      code: "",
                      contact: "",
                      landPhone: "",
                      mobile: ""
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
