import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  AsyncStorage
} from "react-native";
import PasswordInputText from "react-native-hide-show-password-input";
import { Card, ListItem, Icon, Input } from "react-native-elements";
import Divider from "react-native-divider";
import Button from "../components/ButtonComponent";
import gql from "graphql-tag";
import { withApollo } from "react-apollo";
const themeColor = "#6600FF";
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "hospital",
      password: "hospital"
    };
  }
  _login = async () => {
    let data = await this.props.client.query({
      query: gql`
        query getUserAndBranch($name: String, $password: String) {
          getUserAndBranch(name: $name, password: $password) {
            branch {
              id
            }
            user {
              id
            }
          }
        }
      `,
      variables: {
        name: this.state.username,
        password: this.state.password
      }
    });
    AsyncStorage.setItem("userId", data.data.getUserAndBranch.user.id);
    AsyncStorage.setItem("branchId", data.data.getUserAndBranch.branch.id);
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
            <PasswordInputText
              value={this.state.password}
              onChangeText={password => this.setState({ password })}
            />
          </View>
          <Button
            textColor="white"
            buttonColor={themeColor}
            radius="50"
            style={{
              width: WIDTH / 5,
              height: HEIGHT / 25,
              marginVertical: HEIGHT / 30,
              alignSelf: "center"
            }}
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
  },
  ButtonStyles: {
    width: WIDTH / 8,
    height: HEIGHT / 20,
    marginVertical: HEIGHT / 30
  }
});
export default withApollo(Login);
