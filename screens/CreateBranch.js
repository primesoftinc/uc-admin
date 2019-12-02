import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button, Input } from "react-native-elements";
import Header from "../util/Header";
import gql from "graphql-tag";
import { withApollo } from "react-apollo";
import Toast, { DURATION } from "react-native-easy-toast";
import _ from "lodash";

class CreateBranch extends Component {
  constructor(props) {
    super(props);
    console.log("fxh");
    this.state = {
      position: "top",
      branch: {
        branchName: "",
        email: "",
        code: "",
        landPhone: "",
        contact: "",
        mobile: "",
        id: null,
        lat: "",
        lon: ""
      }
    };
    this._getBranchDetails = this._getBranchDetails.bind(this);
  }
  _createBranch = async () => {
    console.log(this.state.branch, "create");
    let res = await this.props.client.mutate({
      mutation: gql`
        mutation saveBranch($branch: BranchInput) {
          saveBranch(branch: $branch) {
            branchName
            id
          }
        }
      `,
      variables: {
        branch: this.state.branch
      }
    });
    console.log("create end", res);
    const { saveBranch } = res.data;
    if (_.isEmpty(saveBranch.id)) {
      this.onClick("Save failed", "top", 1000);
    } else {
      this.onClick("Save succesfull..", "top", 100);
    }

    this.setState({
      branch: { branchName: "" }
    });
  };
  _updateBranch = async () => {
    await this.props.client.mutate({
      mutation: gql`
        mutation updateBranch($branch: BranchInput) {
          saveBranch(branch: $branch) {
            branchName
            id
          }
        }
      `,
      variables: {
        branch: this.state.branch
      }
    });
  };
  _getBranchDetails = async () => {
    console.log("method");

    var res = await this.props.client.query({
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
    delete res.data.getBranchById["__typename"];
    var branchdata = res.data.getBranchById;
    console.log(branchdata, "branchdata");
    this.setState({ branch: branchdata });
  };
  componentDidMount() {
    var branchId = this.props.navigation.state.params.branch.id;
    if (branchId) {
      console.log("if");
      this._getBranchDetails();
    }
    console.log("end od comp");
  }
  onClick = (text, position, duration) => {
    this.setState({
      position: position
    });

    this.refs.toast.show(text, duration);
  };
  render() {
    const {
      branchName,
      code,
      landPhone,
      email,
      mobile,
      contact,
      lat,
      lon,
      id
    } = this.state.branch;
    const { branch } = this.state;
    return (
      <ScrollView>
        <Header />
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "#6699ff", fontSize: 25 }}>Create Branch</Text>

          <Input
            errorStyle={{ color: "red" }}
            errorMessage=""
            label="Branch Name"
            placeholder="Branch Name"
            value={branchName}
            style={styles.textInputContainerStyle}
            onChangeText={text =>
              this.setState(prevState => ({
                ...prevState,
                branch: { ...branch, branchName: text }
              }))
            }
          />

          <Input
            label="Email"
            textContentType="emailAddress"
            value={email}
            style={styles.textInputContainerStyle}
            onChangeText={text =>
              this.setState(prevState => ({
                ...prevState,
                branch: { ...branch, email: text }
              }))
            }
            placeholder="Email"
          />

          <Input
            label="Code"
            value={code}
            style={styles.textInputContainerStyle}
            onChangeText={text =>
              this.setState(prevState => ({
                ...prevState,
                branch: { ...branch, code: text }
              }))
            }
            placeholder="Code"
          />

          <Input
            label="Land Phone"
            value={landPhone}
            style={styles.textInputContainerStyle}
            onChangeText={text =>
              this.setState(prevState => ({
                ...prevState,
                branch: { ...branch, landPhone: text }
              }))
            }
            placeholder="Land Phone"
          />

          <Input
            label="Contact"
            value={contact}
            style={styles.textInputContainerStyle}
            onChangeText={text =>
              this.setState(prevState => ({
                ...prevState,
                branch: { ...branch, contact: text }
              }))
            }
            placeholder="Contact"
          />

          <Input
            label="latitude"
            value={lat}
            style={styles.textInputContainerStyle}
            onChangeText={text =>
              this.setState(prevState => ({
                ...prevState,
                branch: { ...branch, lat: Number(text) }
              }))
            }
            placeholder="latitude"
          />

          <Input
            label="longitude"
            value={lon}
            onChangeText={text =>
              this.setState(prevState => ({
                ...prevState,
                branch: { ...branch, lon: Number(text) }
              }))
            }
            placeholder="longitude"
            style={styles.textInputContainerStyle}
          />

          <Input
            style={styles.textInputContainerStyle}
            label="Mobile"
            value={mobile}
            onChangeText={text =>
              this.setState(prevState => ({
                ...prevState,
                branch: { ...branch, mobile: text }
              }))
            }
            placeholder="Mobile"
          />
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              padding: 10
            }}
          >
            <Button
              containerStyle={{ width: 100 }}
              title="save"
              onPress={() => {
                if (id) {
                  this._updateBranch();
                } else {
                  this._createBranch();
                }
              }}
            />
            <Toast ref="toast" position={this.state.position} />
          </View>
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  textInputContainerStyle: {
    borderBottomWidth: 1,
    borderBottomColor: "#4e38fe",
    padding: 10
  }
});

export default withApollo(CreateBranch);
