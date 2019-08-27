import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
const add_User = gql`
  mutation saveUser($name: String, $email: String, $emailVerified: Boolean) {
    saveUser(
      user: { name: $name, email: $email, emailVerified: $emailVerified }
    ) {
      id
    }
  }
`;
export default class CreateBranch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      emailVerified: ""
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
                  label="userName"
                  placeholder="userName"
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
                  label="emailVerified"
                  value={this.state.emailVerified}
                  onChangeText={text => this.setState({ emailVerified: text })}
                  placeholder="emailVerified"
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
