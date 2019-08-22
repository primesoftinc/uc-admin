import React, { Component } from "react";
import {
  Alert,
  Text,
  View,
  StyleSheet,
  Switch,
  ScrollView
} from "react-native";
import { Card, ListItem, Icon, Input } from "react-native-elements";
import Divider from "react-native-divider";
import Button from "../components/ButtonComponent";
import gql from "graphql-tag";
import { withApollo } from "react-apollo";
const themeColor = "#6600FF";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }
  _login = async () => {
    let data = await this.props.client.query({
      query: gql`
        query getUser($name: String, $password: String) {
          getUser(name: $name, password: $password) {
            id
          }
        }
      `,
      variables: {
        name: this.state.username,
        password: this.state.password
      }
    });
    console.log(data);
    this.props.navigation.navigate("HomeScreen");
  };
  render() {
    return (
      <ScrollView contentContainerStyle={styles.background}>
        <Card containerStyle={{ borderRadius: 15 }}>
          <View>
            <Input
              label="Name"
              labelStyle={[styles.label]}
              inputContainerStyle={{ borderColor: themeColor }}
              containerStyle={{ marginTop: 30 }}
              placeholder="Username"
              value={this.state.username}
              onChangeText={text => this.setState({ username: text })}
            />
          </View>
          <View>
            <Input
              label="password"
              labelStyle={styles.label}
              inputContainerStyle={{ borderColor: themeColor }}
              containerStyle={{ marginTop: 30 }}
              placeholder="password"
              value={this.state.password}
              onChangeText={text => this.setState({ password: text })}
            />
          </View>
          <Button
            textColor="white"
            buttonColor={themeColor}
            radius="25"
            style={{ marginTop: 20 }}
            width="335"
            title="Sign In"
            onPress={this._login}
          />
        </Card>
        <View
          style={{ paddingLeft: 20, paddingRight: 20, paddingVertical: 20 }}
        >
          <Divider
            borderColor={themeColor}
            color={"#FFF"}
            orientation="center"
            style={{ paddingLeft: 20, paddingRight: 20 }}
          >
            Or
          </Divider>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Button
            icon={
              <Icon
                name="google"
                type="font-awesome"
                size={25}
                color={themeColor}
                iconStyle={{ paddingLeft: 5, paddingRight: 20 }}
              />
            }
            textColor={themeColor}
            buttonColor="white"
            radius="25"
            width="335"
            title="Signin with Google"
            textStyle={{ fontSize: 15, color: "#fff" }}
            type="solid"
          />
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 20
          }}
        >
          <Button
            icon={
              <Icon
                name="facebook"
                type="font-awesome"
                size={25}
                color={themeColor}
                iconStyle={{ paddingLeft: 5, paddingRight: 20 }}
              />
            }
            textColor={themeColor}
            buttonColor="white"
            radius="25"
            width="335"
            title="Signin with Facebook"
            textStyle={{ fontSize: 15, color: "#fff" }}
            type="solid"
          />
        </View>
        <View
          style={{ paddingLeft: 20, paddingRight: 20, paddingVertical: 20 }}
        >
          <Divider
            borderColor={themeColor}
            color={"#FFF"}
            orientation="center"
            style={{ paddingLeft: 20, paddingRight: 20 }}
          >
            Or
          </Divider>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: themeColor
          }}
        >
          <Button
            title="Create a New Account"
            type="outline"
            size="medium"
            onPress={{}}
            radius="25"
            textColor={themeColor}
            buttonColor="#fff"
          />
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  background: {
    backgroundColor: themeColor,
    flex: 1,
    paddingTop: 50
  },
  label: {
    color: themeColor,
    fontWeight: "normal"
  },
  container: {
    width: 350,
    justifyContent: "center"
  },
  shadow: {
    elevation: 10,
    borderColor: "black",
    shadowOffset: { width: 40, height: 40 },
    shadowOpacity: 1,
    shadowColor: "black"
  }
});
export default withApollo(Login);
