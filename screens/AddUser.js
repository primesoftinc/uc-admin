import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Button, CheckBox } from "react-native-elements";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
const add_User = gql`
  mutation saveUser(
    $firstName: String
    $lastName: String
    $name: String
    $email: String
    $password: String
    $phone: String
    $address: String
    $role: String
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
export default class AddUser extends Component {
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
        <Mutation mutation={add_User}>
          {saveData => (
            <View>
              <View
                style={{
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ color: "#6699ff", fontSize: 25 }}>Add User</Text>
              </View>
              <View
                style={{
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <TextInput
                  label="FirstName"
                  placeholder="FirstName"
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
                  label="LastName"
                  placeholder="LastName"
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
                  label="UserName"
                  placeholder="UserName"
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
                  label="email"
                  textContentType="emailAddress"
                  value={this.state.email}
                  onChangeText={text => this.setState({ email: text })}
                  placeholder="email"
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
                  label="password"
                  value={this.state.password}
                  onChangeText={text => this.setState({ password: text })}
                  placeholder="Paassword"
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
                  label="phone"
                  value={this.state.phone}
                  onChangeText={text => this.setState({ phone: text })}
                  placeholder="phone"
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
                  label="emailVerified"
                  value={this.state.emailVerified}
                  onChangeText={text => this.setState({ emailVerified: text })}
                  placeholder="emailVerified"
                  style={styles.textInputContainerStyle}
                />
              </View>
              <CheckBox
                center
                title="Click Here to Remove This Item"
                iconRight
                iconType="material"
                checkedIcon="clear"
                uncheckedIcon="add"
                checkedColor="red"
                checked={this.state.checked}
              />
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Button
                  containerStyle={{ width: 100 }}
                  title="save"
                  onPress={() => {
                    saveData({
                      variables: {
                        name: this.state.name,
                        email: this.state.email,
                        emailVerified: this.state.emailVerified
                      }
                    }).then(() => {
                      return <Text>Sucess</Text>;
                    });
                    this.setState({
                      email: "",
                      name: "",
                      emailVerified: ""
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
