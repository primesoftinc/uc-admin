import React, { Component } from "react";
import { Mutation, withApollo } from "react-apollo";
import gql from "graphql-tag";
import { Formik, Field } from "formik";

import { Input, Button } from "react-native-elements";
import { View, Text, TextInput, StyleSheet, AsyncStorage } from "react-native";
import _ from "lodash";
import { FormikMultiSelect } from "../components/FormikMultiSelect";
import { FormikCheckBox } from "../components/FormikCheckBox";

const CREATE_USER = gql`
  mutation saveBranchUser($branchUser: BranchUserInput) {
    saveBranchUser(branchUser: $branchUser) {
      id
    }
  }
`;

class FormikCreateUser extends Component {
  constructor() {
    super();
    this.state = {
      branchUser: { user: { isDoctor: false } },
      role: [],
      doctorSpecializations: [],
      checked: false,
      slectedRoleIds: [],
      selectedSpecializationIds: [],
      selectedSpecializations: [],
      selectedRoles: []
    };
  }

  _getBranchUserByUserId = async id => {
    var branchUser = await this.props.client.query({
      query: gql`
        query getBranchUserById($id: UUID) {
          getBranchUserById(id: $id) {
            id
            branch {
              id
            }
            user {
              id
              name
              address
              password
              firstName
              lastName
              email
              isDoctor
              userRoles {
                id
                role {
                  id
                }
              }
              doctors {
                id
                doctorSpecializations {
                  id
                  specialization {
                    id
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        id: id
      }
    });
    console.log(
      "branchUser.data.getBranchUserById",
      branchUser.data.getBranchUserById
    );
    const loBranchuser = {
      ...branchUser.data.getBranchUserById,
      user: {
        ...branchUser.data.getBranchUserById.user,
        selectedRoles: branchUser.data.getBranchUserById.user.userRoles.map(
          ur => ur.role.id
        ),
        selectedSpecializations:
          branchUser.data.getBranchUserById.user.doctors.length > 0 &&
          branchUser.data.getBranchUserById.user.doctors[0] &&
          branchUser.data.getBranchUserById.user.doctors[0]
            .doctorSpecializations.length > 0
            ? branchUser.data.getBranchUserById.user.doctors[0].doctorSpecializations.map(
                ur => ur.specialization.id
              )
            : []
      }
    };
    console.log(loBranchuser, "COMPONENTDODMOUNT");
    this.setState({
      branchUser: loBranchuser
    });
  };

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
  };

  updateSelectedSpecializations = selectedSpecializations => {
    this.setState({ selectedSpecializations });
  };

  updateSelectedRoles = selectedRoles => {
    // console.log(this.props);
    this.setState({ selectedRoles });
    // this.props.form.setFieldValue("user.userRoles", selectedRoles);
    // onChangeText = this.props.form.handleChange("user.lastName");
  };

  _getSpecializations = async () => {
    const { branchUser } = this.state;
    var specializations = await this.props.client.query({
      query: gql`
        query {
          getSpecilaization {
            specializtionName
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
    const { branchUser } = this.state;
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

  async componentDidMount() {
    // const { branchUser } = this.props.navigation.state.params;
    let branchId = await AsyncStorage.getItem("branchId");
    const { branchUser } = this.state;
    const { branch } = branchUser;
    this.setState({
      ...branchUser,
      branch: { ...branch, id: branchId }
    });
    // AsyncStorage.getItem("branchId").then(value => {
    //   this.setState({ branchId: value });
    // });
    await this._getroles();
    await this._getSpecializations();
    if (!_.isEmpty(this.props.navigation.state.params.branchUser)) {
      this._getBranchUserByUserId(
        this.props.navigation.state.params.branchUser.user.id
      );
    }
  }

  _renderForm = props => {
    const { role, doctorSpecializations, branchUser } = this.state;
    const { values } = props;
    console.log(
      "inside renderForm",
      branchUser,
      role,
      doctorSpecializations,
      values
    );

    return (
      <View
        style={{
          width: 400,
          padding: 10,
          padding: 10,
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center"
        }}
      >
        <Input
          label="FirstName"
          placeholder="FirstName"
          value={_.get(values, "branchUser.user.firstName", "")}
          name={"branchUser.user.firstName"}
          onChangeText={props.handleChange("branchUser.user.firstName")}
        />
        <Input
          label="LastName"
          placeholder="LastName"
          value={_.get(values, "branchUser.user.lastName", "")}
          name={"branchUser.user.lastName"}
          onChangeText={props.handleChange("branchUser.user.lastName")}
        />
        <Input
          label="UserName"
          placeholder="UserName"
          value={_.get(values, "branchUser.user.name", "")}
          name={"branchUser.user.name"}
          onChangeText={props.handleChange("branchUser.user.name")}
        />
        <Input
          label="Email"
          placeholder="Email"
          value={_.get(values, "branchUser.user.email", "")}
          name={"branchUser.user.email"}
          onChangeText={props.handleChange("branchUser.user.email")}
        />
        <Input
          label="Address"
          placeholder="Address"
          value={_.get(values, "branchUser.user.address", "")}
          name={"branchUser.user.address"}
          onChangeText={props.handleChange("branchUser.user.address")}
        />

        {role && role.length > 0 ? (
          <View style={{ flexDirection: "row" }}>
            <View style={{ paddingTop: 40 }}>
              <Text style={{ fontSize: 15 }}>Select Role:</Text>
            </View>
            <View>
              <Field
                name="branchUser.user.selectedRoles"
                uniqueKey="id"
                displayKey="roleName"
                component={FormikMultiSelect}
                data={role}
                selectedItems={_.get(
                  values,
                  "branchUser.user.selectedRoles",
                  []
                )}
                // updateSelectedRoles={this.updateSelectedRoles}
              />
            </View>
          </View>
        ) : null}
        <View style={{ alignItems: "center" }}>
          <Field
            name="branchUser.user.isDoctor"
            component={FormikCheckBox}
            title="is Doctor"
          />
        </View>
        {_.get(values, "branchUser.user.isDoctor") ? (
          <View style={{ alignItems: "center", alignSelf: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ alignItems: "center", alignSelf: "center" }}>
                <Field
                  name="branchUser.user.selectedSpecializations"
                  component={FormikMultiSelect}
                  data={doctorSpecializations}
                  uniqueKey="id"
                  displayKey="specializtionName"
                  selectedItems={_.get(
                    values,
                    "branchUser.user.selectedSpecializations",
                    []
                  )}
                />
              </View>
            </View>
          </View>
        ) : null}
        <Button onPress={props.handleSubmit} title="Submit" />
      </View>
    );
  };

  render() {
    const { branchUser, role, specializations } = this.state;

    console.log("inside render: ", branchUser, "jhgdf", role, specializations);

    return (
      <Mutation mutation={CREATE_USER}>
        {(saveData, { loading, data }) => (
          <Formik
            initialValues={{ branchUser: branchUser }}
            onSubmit={(values, actions) => {
              console.log("valuesin dave data", values);
              console.log("map", values.branchUser.user);

              const {
                branchUser,
                branchUser: { user }
              } = values;

              _.forEach(user.userRoles, ur => {
                _.remove(user.selectedRoles, srId => srId == ur.role.id);
              });
              {
              }
              const newRoles = _.map(user.selectedRoles, r => {
                console.log("r", r);
                return {
                  role: {
                    id: r
                  }
                };
              });
              const finalRoles = _.concat(
                user.userRoles ? user.userRoles : [],
                newRoles
              );
              console.log("finalRoles", finalRoles);
              {
                /* delete branchUser.user.selectedRoles; */
              }
              let finalSpecializations = _.has(user.doctors)
                ? user.doctors[0].doctorSpecializations
                : [];
              const newSpecializations = _.map(
                user.selectedSpecializations,
                s => {
                  console.log("s", s);
                  return {
                    specialization: {
                      id: s
                    }
                  };
                }
              );
              if (
                user.isDoctor &&
                _.isLength(user.doctors)
                //values.branchUser.user.doctors.length > 1
              ) {
                console.log("if ds", user);
                _.forEach(user.doctors[0].doctorSpecializations, ds => {
                  _.remove(
                    user.selectedSpecializations,
                    dsId => dsId == ds.specialization.id
                  );
                });
                console.log("after if", user);
                finalSpecializations = _.concate(
                  user.doctors[0].doctorSpecializations,
                  newSpecializations
                );
                console.log("finalSpecializations", finalSpecializations);
              } else {
                finalSpecializations = newSpecializations;
              }

              const loBranchUser = {
                ...values.branchUser,
                user: {
                  ...values.branchUser.user,
                  userRoles: finalRoles
                }
              };
              if (user.isDoctor) {
                loBranchUser.user.doctors = _.map(user.doctors, d => {
                  return {
                    ...d,
                    doctorSpecializations: finalSpecializations
                  };
                });
              }
              console.log("loBranchUser", loBranchUser);
              //let doctorSpecializations = [];
              {
                /* if (values.branchUser.user.isDoctor) {
                doctorSpecializations = _.map(
                  values.branchUser.user.doctors[0].doctorSpecializations,
                  ds => {
                    return {
                      specialization: {
                        id: ds
                      }
                    };
                  }
                );
              } */
              }

              console.log("lobranchuser", loBranchUser);
              saveData({
                variables: {
                  branchUser: loBranchUser
                }
              }).then(() => {
                return console.log("sucess");
              });
              {
                /* this.setState({
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
              }); */
              }
              console.log("values", values);
            }}
            enableReinitialize
            render={this._renderForm}
          />
        )}
      </Mutation>
    );
  }
}

export default withApollo(FormikCreateUser);
