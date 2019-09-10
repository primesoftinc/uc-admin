import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet, AsyncStorage } from "react-native";
import { Button, CheckBox } from "react-native-elements";
import { Specialization, Role } from "../components/DropDown";
import MultiSelect from "react-native-multiple-select";
import { Mutation, withApollo } from "react-apollo";
import gql from "graphql-tag";
const CREATE_USER = gql`
  mutation saveBranchUser(
    $firstName: String
    $lastName: String
    $name: String
    $email: String
    $password: String
    $phoneno: String
    $address: String
    $isDoctor: Boolean
    $userRoles: [UserRoleInput]
    $doctorSpecializations: [DoctorSpecializationInput]
  ) {
    saveBranchUser(
      branchUser: {
        user: {
          firstName: $firstName
          lastName: $lastName
          name: $name
          email: $email
          phone: $phoneno
          address: $address
          password: $password
          isDoctor: $isDoctor
          doctor: [{ doctorSpecializations: $doctorSpecializations }]
          userRoles: $userRoles
        }
      }
    ) {
      id
    }
  }
`;
class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      checked: false,
      doctorSpecializations: "",
      role: "",
      isDoctor: false,
      selectedSpecializations: [],
      selectedRoles: []
    };
  }
  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
  };

  updateSelectedSpecializations = selectedSpecializations => {
    this.setState({ selectedSpecializations });
  };

  updateSelectedRoles = selectedRoles => {
    this.setState({ selectedRoles });
  };

  _getSpecializations = async () => {
    var specializations = await this.props.client.query({
      query: gql`
        query {
          getSpecilaization {
            specializtionName
            branch: id
            id
          }
        }
      `
    });
    this.setState({
      doctorSpecializations: specializations.data.getSpecilaization
    });
  };
  _getroles = async () => {
    var roles = await this.props.client.query({
      query: gql`
        query {
          getRolesList {
            id
            roleName
          }
        }
      `
    });
    this.setState({
      role: roles.data.getRolesList
    });
  };
  componentDidMount() {
    this._getSpecializations();
    this._getroles();
  }
  render() {
    return (
      <View>
        <Mutation mutation={CREATE_USER}>
          {(saveData, { loading, data }) => (
            <View style={{}}>
              <View
                style={{
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ color: "#6699ff", fontSize: 25 }}>
                  Create User
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

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                {this.state.role && this.state.role.length > 0 ? (
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ paddingTop: 40 }}>
                      <Text style={{ fontSize: 15 }}>Select Role:</Text>
                    </View>
                    <View style={{ paddingTop: 0 }}>
                      <Role
                        data={this.state.role}
                        uniqueKey={"id"}
                        displayKey={"roleName"}
                        updateSelectedData={this.updateSelectedRoles}
                      />
                    </View>
                  </View>
                ) : null}
              </View>
              <View style={{ alignItems: "center" }}>
                <CheckBox
                  containerStyle={{
                    width: 400,
                    padding: 10,
                    alignItems: "center"
                  }}
                  center
                  title="is Doctor"
                  checked={this.state.checked}
                  onPress={() => {
                    this.setState({ checked: !this.state.checked });
                    this.setState({ isDoctor: !this.state.isDoctor });
                    AsyncStorage.setItem("checked", this.state.checked);
                  }}
                />
              </View>
              <View style={{ alignItems: "center", alignSelf: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {this.state.checked == true ? (
                    <View style={{ alignItems: "center", alignSelf: "center" }}>
                      <Specialization
                        data={this.state.doctorSpecializations}
                        uniqueKey={"id"}
                        displayKey={"specializtionName"}
                        updateSelectedData={this.updateSelectedSpecializations}
                      />
                    </View>
                  ) : null}
                </View>
              </View>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Button
                  containerStyle={{ width: 100 }}
                  title="save"
                  loading={loading}
                  onPress={() => {
                    const {
                      selectedSpecializations,
                      selectedRoles
                    } = this.state;
                    const doctorSpecializations = selectedSpecializations.map(
                      ds => {
                        return {
                          specialization: {
                            id: ds
                          }
                        };
                      }
                    );

                    const userRoles = selectedRoles.map(r => {
                      return {
                        role: {
                          id: r
                        }
                      };
                    });
                    console.log("usr-ds", userRoles, doctorSpecializations);
                    saveData({
                      variables: {
                        name: this.state.name,
                        firstName: this.state.firstName,
                        lastName: this.state.lastName,
                        email: this.state.email,
                        phone: this.state.phone,
                        password: this.state.password,
                        address: this.state.address,
                        userRoles: userRoles,
                        doctorSpecializations: doctorSpecializations,
                        isDoctor: this.state.isDoctor
                      }
                    }).then(() => {
                      return console.log("sucess");
                    });
                    this.setState({
                      email: "",
                      firstName: "",
                      lastName: "",
                      phone: "",
                      password: "",
                      name: "",
                      address: "",
                      userRoles: "",
                      specialization: "",
                      isDoctor: ""
                    });
                    console.log("saveddata", saveData);
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
export default withApollo(CreateUser);
