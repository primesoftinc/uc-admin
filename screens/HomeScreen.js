import React, { Component } from "react";
import { View, Platform, TouchableHighlight } from "react-native-web";
import Header from "../util/Header";
import { Button, Icon, Text, Badge } from "react-native-elements";
import { withApollo } from "react-apollo";
import gql from "graphql-tag";

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      branchId: ""
    };
  }
  _getBranchId = async () => {
    await this.props.client.query({
      query: gql`
        query getBranchId($userId: UUID) {
          getBranchId(id: $userId) {
            branch {
              id
            }
          }
        }
      `,
      variables: {
        userId: this.state.userId
      }
    });
    this.props.navigation.navigate("CreateRole");
  };

  render() {
    console.log("userId" + this.state.userId);
    console.log("branchId" + this.state.branchId);

    // var p = this.state.getUserAndBranch;
    // var s = JSON.parse(p);
    // console.log(s);

    return (
      <View>
        <Header />

        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <TouchableHighlight
            onPress={() => this.props.navigation.navigate("UserList")}
          >
            <View
              style={{
                width: 400,

                height: 100,

                flexDirection: "row",

                borderColor: "#cecece",

                borderWidth: 1,

                margin: 15,

                marginBottom: 0,

                borderRadius: 2,

                ...Platform.select({
                  android: {
                    elevation: 1
                  },

                  default: {
                    shadowColor: "rgba(0,0,0, .2)",

                    shadowOffset: { height: 0, width: 0 },

                    shadowOpacity: 1,

                    shadowRadius: 1
                  }
                })
              }}
            >
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View
                  style={{
                    width: 100,

                    justifyContent: "center",

                    backgroundColor: "#dd4b39"
                  }}
                >
                  <Icon
                    name="list-ol"
                    color="#fff"
                    size={35}
                    type={"font-awesome"}
                  />
                </View>

                <View style={{ flex: 1, padding: 5 }}>
                  <Text h4>Appointments</Text>

                  <View style={{ flexDirection: "row", padding: 5 }}>
                    <Badge
                      status="primary"
                      badgeStyle={{ borderRadius: 3 }}
                      value={
                        <Text style={{ color: "#fff", padding: 15 }}>
                          All - 100
                        </Text>
                      }
                    />

                    <Badge
                      status="success"
                      badgeStyle={{ borderRadius: 3 }}
                      value={
                        <Text style={{ color: "#fff", padding: 15 }}>
                          Done - 100
                        </Text>
                      }
                    />

                    <Badge
                      status="error"
                      badgeStyle={{ borderRadius: 3 }}
                      value={
                        <Text style={{ color: "#fff", padding: 15 }}>
                          Can - 100
                        </Text>
                      }
                    />
                  </View>
                </View>
              </View>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={() => this.props.navigation.navigate("UserList")}
          >
            <View
              style={{
                width: 400,

                height: 100,

                flexDirection: "row",

                borderColor: "#cecece",

                borderWidth: 1,

                margin: 15,

                marginBottom: 0,

                borderRadius: 2,

                ...Platform.select({
                  android: {
                    elevation: 1
                  },

                  default: {
                    shadowColor: "rgba(0,0,0, .2)",

                    shadowOffset: { height: 0, width: 0 },

                    shadowOpacity: 1,

                    shadowRadius: 1
                  }
                })
              }}
            >
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View
                  style={{
                    width: 100,

                    justifyContent: "center",

                    backgroundColor: "#00c0ef"
                  }}
                >
                  <Icon
                    name="user-md"
                    color="#fff"
                    size={35}
                    type={"font-awesome"}
                  />
                </View>

                <View style={{ flex: 1, padding: 5 }}>
                  <Text h4>Doctors</Text>

                  <View style={{ flexDirection: "row", padding: 5 }}>
                    <Badge
                      status="primary"
                      badgeStyle={{ borderRadius: 3 }}
                      value={
                        <Text style={{ color: "#fff", padding: 15 }}>
                          All - 100
                        </Text>
                      }
                    />

                    <Badge
                      status="success"
                      badgeStyle={{ borderRadius: 3 }}
                      value={
                        <Text style={{ color: "#fff", padding: 15 }}>
                          Done - 100
                        </Text>
                      }
                    />

                    <Badge
                      status="error"
                      badgeStyle={{ borderRadius: 3 }}
                      value={
                        <Text style={{ color: "#fff", padding: 15 }}>
                          Can - 100
                        </Text>
                      }
                    />
                  </View>
                </View>
              </View>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={() => this.props.navigation.navigate("UserList")}
          >
            <View
              style={{
                width: 400,

                height: 100,

                flexDirection: "row",

                borderColor: "#cecece",

                borderWidth: 1,

                margin: 15,

                marginBottom: 0,

                borderRadius: 2,

                ...Platform.select({
                  android: {
                    elevation: 1
                  },

                  default: {
                    shadowColor: "rgba(0,0,0, .2)",

                    shadowOffset: { height: 0, width: 0 },

                    shadowOpacity: 1,

                    shadowRadius: 1
                  }
                })
              }}
            >
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View
                  style={{
                    width: 100,

                    justifyContent: "center",

                    backgroundColor: "#f39c12"
                  }}
                >
                  <Icon
                    name="user"
                    color="#fff"
                    size={35}
                    type={"font-awesome"}
                  />
                </View>

                <View style={{ flex: 1, padding: 5 }}>
                  <Text h4>Users</Text>

                  <View style={{ flexDirection: "row", padding: 5 }}>
                    <Badge
                      status="primary"
                      badgeStyle={{ borderRadius: 3 }}
                      value={
                        <Text style={{ color: "#fff", padding: 15 }}>
                          All - 100
                        </Text>
                      }
                    />

                    <Badge
                      status="success"
                      badgeStyle={{ borderRadius: 3 }}
                      value={
                        <Text style={{ color: "#fff", padding: 15 }}>
                          Done - 100
                        </Text>
                      }
                    />

                    <Badge
                      status="error"
                      badgeStyle={{ borderRadius: 3 }}
                      value={
                        <Text style={{ color: "#fff", padding: 15 }}>
                          Can - 100
                        </Text>
                      }
                    />
                  </View>
                </View>
              </View>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={() => this.props.navigation.navigate("UserList")}
          >
            <View
              style={{
                width: 400,

                height: 100,

                flexDirection: "row",

                borderColor: "#cecece",

                borderWidth: 1,

                margin: 15,

                marginBottom: 0,

                borderRadius: 2,

                ...Platform.select({
                  android: {
                    elevation: 1
                  },

                  default: {
                    shadowColor: "rgba(0,0,0, .2)",

                    shadowOffset: { height: 0, width: 0 },

                    shadowOpacity: 1,

                    shadowRadius: 1
                  }
                })
              }}
            >
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View
                  style={{
                    width: 100,

                    justifyContent: "center",

                    backgroundColor: "#00a65a"
                  }}
                >
                  <Icon
                    name="gear"
                    color="#fff"
                    size={35}
                    type={"font-awesome"}
                  />
                </View>

                <View style={{ flex: 1, padding: 5 }}>
                  <Text h4>Settings</Text>

                  <View style={{ flexDirection: "row", padding: 5 }}>
                    <Badge
                      status="primary"
                      badgeStyle={{ borderRadius: 3 }}
                      value={
                        <Text style={{ color: "#fff", padding: 15 }}>
                          All - 100
                        </Text>
                      }
                    />

                    <Badge
                      status="success"
                      badgeStyle={{ borderRadius: 3 }}
                      value={
                        <Text style={{ color: "#fff", padding: 15 }}>
                          Done - 100
                        </Text>
                      }
                    />

                    <Badge
                      status="error"
                      badgeStyle={{ borderRadius: 3 }}
                      value={
                        <Text style={{ color: "#fff", padding: 15 }}>
                          Can - 100
                        </Text>
                      }
                    />
                  </View>
                </View>
              </View>
            </View>
          </TouchableHighlight>
        </View>

        {/* <Text style={{ fontSize: 30, alignSelf: "center" }}>
          {" "}
          {this.props.navigation.state.params.name}
        </Text> */}
        <Button
          title="CreatePrivilege"
          onPress={() => this.props.navigation.navigate("CreatePrivilege")}
        />
        <Button
          title="PrivilegeList"
          onPress={() => this.props.navigation.navigate("PrivilegeList")}
        />
        <Button
          title="DoctorList"
          onPress={() => this.props.navigation.navigate("DoctorList")}
        />
        <Button
          title="BranchInfo"
          onPress={() => this.props.navigation.navigate("BranchInfo")}
        />
        <Button
          title="AppointmentList"
          onPress={() => this.props.navigation.navigate("AppointmentList")}
        />
        <Button
          title="UserList"
          onPress={() => this.props.navigation.navigate("UserList")}
        />

        <Button
          title="createBranch"
          onPress={() =>
            this.props.navigation.navigate("CreateBranch", { branch: "" })
          }
        />

        <Button
          title="BranchList"
          onPress={() => this.props.navigation.navigate("BranchList")}
        />

        <Button
          title="DoctorUnavailability"
          onPress={() => this.props.navigation.navigate("DoctorUnavailability")}
        />

        <Button
          title="CreateDoctorSlot"
          onPress={() => this.props.navigation.navigate("CreateDoctorSlot")}
        />
        <Button
          title="Create Role"
          onPress={() => this.props.navigation.navigate("CreateRole")}
        />

        <Button
          title="RoleList"
          onPress={() => this.props.navigation.navigate("RoleList")}
        />
        <Button
          title="FormikCreateUser"
          onPress={() =>
            this.props.navigation.navigate("FormikCreateUser", {
              branchUser: ""
            })
          }
        />
        <Button
          title="UnavailabilityList"
          onPress={() => this.props.navigation.navigate("UnavailabilityList")}
        />
      </View>
    );
  }
}
export default withApollo(HomeScreen);
