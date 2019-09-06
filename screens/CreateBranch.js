import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import gql from "graphql-tag";
import { withApollo } from "react-apollo";

class CreateBranch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      branchName: "",
      email: "",
      code: "",
      landPhone: "",
      contact: "",
      mobile: "",
      id: ""
    };
    this._getBranchDetails = this._getBranchDetails.bind(this);
  }
  _createBranch = async () => {
    var dd = await this.props.client.mutate({
      mutation: gql`
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
      `,
      variables: {
        branchName: this.state.branchName,
        code: this.state.code,
        contact: this.state.contact,
        landPhone: this.state.landPhone,
        email: this.state.email,
        mobile: this.state.mobile
      }
    });
    this.setState({
      branchName: "",
      email: "",
      code: "",
      landPhone: "",
      contact: "",
      mobile: ""
    });
  };
  _updateBranch = async () => {
    await this.props.client.mutate({
      mutation: gql`
        mutation updateBranch(
          $branchName: String
          $email: String
          $code: String
          $landPhone: String
          $contact: String
          $mobile: String
          $id: UUID
        ) {
          updateBranch(
            branchName: $branchName
            email: $email
            code: $code
            landPhone: $landPhone
            contact: $contact
            mobile: $mobile
            id: $id
          )
        }
      `,
      variables: {
        branchName: this.state.branchName,
        code: this.state.code,
        contact: this.state.contact,
        landPhone: this.state.landPhone,
        email: this.state.email,
        mobile: this.state.mobile,
        id: this.props.navigation.state.params.branch.id
      }
    });
    this.setState({
      branchName: "",
      email: "",
      code: "",
      landPhone: "",
      contact: "",
      mobile: ""
    });
  };
  _getBranchDetails = async () => {
    console.log("method");

    var d = await this.props.client.query({
      query: gql`
        query getBranchById($id: UUID) {
          getBranchById(id: $id) {
            branchName
            email
            code
            landPhone
            contact
            mobile
            id
          }
        }
      `,
      variables: {
        id: this.props.navigation.state.params.branch.id
      }
    });
    this.setState({
      branchName: d.data.getBranchById.branchName,
      email: d.data.getBranchById.email,
      code: d.data.getBranchById.code,
      landPhone: d.data.getBranchById.landPhone,
      contact: d.data.getBranchById.contact,
      mobile: d.data.getBranchById.mobile,
      id: d.data.getBranchById.id
    });
  };
  componentDidMount() {
    var branchId = this.props.navigation.state.params.branch.id;
    if (branchId != null) {
      console.log("if");
      this._getBranchDetails();
    } else {
      this.setState({ id: "" });
    }
    console.log("end od comp");
  }

  render() {
    return (
      <View>
        <View>
          <View
            style={{
              padding: 10,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ color: "#6699ff", fontSize: 25 }}>
              Create Branch
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
              label="Branch Name"
              placeholder="Branch Name"
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
              label="Code"
              value={this.state.code}
              onChangeText={text => this.setState({ code: text })}
              placeholder="Code"
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
              label="Land Phone"
              value={this.state.landPhone}
              onChangeText={text => this.setState({ landPhone: text })}
              placeholder="Land Phone"
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
              label="Contact"
              value={this.state.contact}
              onChangeText={text => this.setState({ contact: text })}
              placeholder="Contact"
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
              label="Contact"
              value={this.state.contact}
              onChangeText={text => this.setState({ contact: text })}
              placeholder="Contact"
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
              label="Mobile"
              value={this.state.mobile}
              onChangeText={text => this.setState({ mobile: text })}
              placeholder="Mobile"
              style={styles.textInputContainerStyle}
            />
          </View>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Button
              containerStyle={{ width: 100 }}
              title="save"
              onPress={() => {
                if (this.state.id == "") {
                  this._createBranch();
                } else {
                  this._updateBranch();
                }
              }}
            />
          </View>
        </View>
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

export default withApollo(CreateBranch);
