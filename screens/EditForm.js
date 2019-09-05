import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
const UPDATE_USER = gql`
  mutation updateUser(
    $name: String
    $email: String
    $password: String
    $firstName: String
    $lastName: String
    $phone: String
    $address: String
    $id: UUID
  ) {
    updateUser(
      name: $name
      email: $email
      password: $password
      firstName: $firstName
      lastName: $lastName
      phone: $phone
      address: $address
      id: $id
    )
  }
`;
export default class CreateBranch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.navigation.state.params.rowData.name,
      email: this.props.navigation.state.params.rowData.email,
      password: this.props.navigation.state.params.rowData.password,
      phone: this.props.navigation.state.params.rowData.phone,
      address: this.props.navigation.state.params.rowData.address,
      firstName: this.props.navigation.state.params.rowData.firstName,
      lastName: this.props.navigation.state.params.rowData.lastName,
      id: this.props.navigation.state.params.rowData.id
    };
  }

  render() {
    return (
      <View>
        <Mutation mutation={UPDATE_USER}>
          {updateData => (
            <View>
              <View
                style={{
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ color: "#6699ff", fontSize: 25 }}>
                  Edit Form
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
                  value={this.state.firstName}
                  onChangeText={text => this.setState({ firstName: text })}
                  placeholder="First Name"
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
                  value={this.state.lastName}
                  onChangeText={text => this.setState({ lastName: text })}
                  placeholder="last Name"
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
                  label="Password"
                  value={this.state.password}
                  onChangeText={text => this.setState({ password: text })}
                  placeholder="Password"
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
                    updateData({
                      variables: {
                        name: this.state.name,
                        firstName: this.state.firstName,
                        lastName: this.state.lastName,
                        phone: this.state.phone,
                        email: this.state.email,
                        address: this.state.address,
                        password: this.state.password,
                        id: this.state.id
                      }
                    });
                    this.setState({
                      name: "",
                      firstName: "",
                      lastName: "",
                      phone: "",
                      email: "",
                      address: "",
                      password: ""
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
