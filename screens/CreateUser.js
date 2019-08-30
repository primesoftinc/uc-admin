import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Button, CheckBox } from "react-native-elements";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
const CREATE_USER = gql`
  mutation saveUser(
    $firstName: String
    $lastName: String
    $name: String
    $email: String
    $password: String
    $phone: String
    $address: String
  ) {
    saveUser(
      user: {
        firstName: $firstName
        lastName: $lastName
        name: $name
        email: $email
        password: $password
        phone: $phone
        address: $address
      }
    ) {
      id
    }
  }
`;
export default class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      name: "",
      email: "",
      password: "",
      phone: "",
      address: ""
    };
  }

  render() {
    return (
      <View>
        <Mutation mutation={CREATE_USER}>
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
                  Add Privilege
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
                  label="First Name"
                  placeholder="First Name"
                  value={this.state.firstName}
                  onChangeText={text => this.setState({ firstName: text })}
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
                  label="Last Name"
                  placeholder="Last Name"
                  value={this.state.lastName}
                  onChangeText={text => this.setState({ lastName: text })}
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
                  label="User Name"
                  placeholder="User Name"
                  value={this.state.name}
                  onChangeText={text => this.setState({ name: text })}
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
                  textContentType="password"
                  label="Password"
                  value={this.state.password}
                  onChangeText={text => this.setState({ password: text })}
                  placeholder="Pass word"
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
                  label="Phone"
                  value={this.state.phone}
                  onChangeText={text => this.setState({ phone: text })}
                  placeholder="Phone"
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
                  label="Address"
                  value={this.state.address}
                  onChangeText={text => this.setState({ address: text })}
                  placeholder="Address"
                  style={styles.textInputContainerStyle}
                />
              </View>

              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Button
                  containerStyle={{ width: 100 }}
                  title="save"
                  onPress={() => {
                    saveData({
                      variables: {
                        name: this.state.name,
                        firstName: this.state.firstName,
                        lastName: this.state.lastName,
                        email: this.state.email,
                        phone: this.state.phone,
                        password: this.state.password,
                        address: this.state.address
                      }
                    }).then(() => {
                      return <Text>Sucess</Text>;
                    });
                    this.setState({
                      email: "",
                      firstName: "",
                      lastName: "",
                      phone: "",
                      password: "",
                      name: "",
                      address: ""
                    });
                    console.log("fhgk");
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