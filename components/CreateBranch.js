import React, { Component } from "react";
import { ApolloClient, HttpLink, InMemoryCache } from "apollo-boost";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://192.168.2.218:8080/graphql"
  }),
  cache: new InMemoryCache()
});
const add_User = gql`
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
                <TextInput
                  label="branchName"
                  placeholder="branchName"
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
                  label="code;"
                  value={this.state.code}
                  onChangeText={text => this.setState({ code: text })}
                  placeholder="code"
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
                  label="landPhone"
                  value={this.state.landPhone}
                  onChangeText={text => this.setState({ landPhone: text })}
                  placeholder="landPhone"
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
                  label="contact"
                  value={this.state.contact}
                  onChangeText={text => this.setState({ contact: text })}
                  placeholder="contact"
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
                  label="mobile"
                  value={this.state.mobile}
                  onChangeText={text => this.setState({ mobile: text })}
                  placeholder="mobile"
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
                    }).then(() => {
                      return <Text>Sucess</Text>;
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
