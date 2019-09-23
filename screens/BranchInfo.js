import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  Dimensions,
  AsyncStorage
} from "react-native";
import gql from "graphql-tag";

import { Query, withApollo } from "react-apollo";
import Header from "../util/Header";

import { Card, Text, Button, Icon } from "react-native-elements";
const width = Dimensions.get("window").width;
class BranchInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      branchId: "",
      branch: {
        branchName: "",
        email: "",
        code: "",
        landPhone: "",
        contact: "",
        mobile: "",
        id: ""
      }
    };
    this._getBranchDetails = this._getBranchDetails.bind(this);
  }
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
        id: this.state.branchId
      }
    });
    delete res.data.getBranchById["__typename"];
    var branchdata = res.data.getBranchById;
    console.log(branchdata, "branchdata");
    this.setState({ branch: branchdata });
  };
  componentDidMount() {
    AsyncStorage.getItem("branchId").then(value => {
      this.setState({ branchId: value });
      this._getBranchDetails();
    });
  }
  render() {
    const { branchName, email, landPhone, code, contact } = this.state.branch;
    return (
      <View>
        <Header />
        <Card containerStyle={styles.cardContainer}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 4 }}>
              <Text style={{ padding: 10 }}>Name: {branchName}</Text>
              <Text style={{ padding: 10 }}>Email : {email}</Text>
              <Text style={{ padding: 10 }}>{landPhone}</Text>
              <Text style={{ padding: 10 }}>Code : {code}</Text>
              <Text style={{ padding: 10 }}>Contact : {contact}</Text>

              <View style={{ paddingTop: 5 }}></View>
            </View>
            <Icon
              name="edit"
              color="blue"
              onPress={() =>
                this.props.navigation.navigate("CreateBranch", {
                  branch: this.state.branch
                })
              }
            />
            <Icon
              name="delete"
              color="red"
              onPress={() => console.log("kjshdg")}
            />
          </View>
        </Card>
      </View>
    );
  }
}
export default withApollo(BranchInfo);

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10,
    shadowRadius: 5,
    shadowColor: "#5c5c5c",
    height: 250,
    width: (width * 2) / 3,
    justifyContent: "center"
  },
  textStyle: {
    color: "#5B5850",
    fontStyle: "normal",
    fontSize: 15
  },
  textHospitalName: {
    color: "#5B5850",
    fontStyle: "normal",
    fontSize: 15
  },
  textBase: {
    color: "#4e38fe",
    fontStyle: "normal",
    fontSize: 15
  },
  textAddress: {
    color: "#5B5850",
    fontStyle: "normal",
    fontSize: 15
  }
});
