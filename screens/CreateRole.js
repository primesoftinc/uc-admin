import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet, AsyncStorage } from "react-native";
import { Button } from "react-native-elements";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
const CREATE_ROLE = gql`
  mutation saveRole($roleName: String, $branchId: UUID) {
    saveRole(role: { roleName: $roleName, branch: { id: $branchId } }) {
      id
    }
  }
`;
export default class CreateRole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roleName: "",
      branchId: ""
    };
  }

  componentDidMount() {
    AsyncStorage.getItem("branchId").then(value => {
      this.setState({ branchId: value });
    });
  }
  render() {
    console.log("Role...branchId" + this.state.branchId);
    return (
      <View>
        <Mutation mutation={CREATE_ROLE}>
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
                  Create Role
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
                  label="RoleName"
                  placeholder="RoleName"
                  value={this.state.roleName}
                  onChangeText={text => this.setState({ roleName: text })}
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
                        roleName: this.state.roleName,
                        branchId: this.state.branchId
                      }
                    }).then(() => {
                      return <Text>Sucess</Text>;
                    });
                    this.setState({
                      roleName: "",
                      branchId: ""
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
