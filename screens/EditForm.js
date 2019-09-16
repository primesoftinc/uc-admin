import React, { Component } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import _ from "lodash";
import { View, Text, TextInput, StyleSheet, Dimensions } from "react-native";
import { Button } from "react-native-elements";
import "react-datepicker/dist/react-datepicker.css";

import { Mutation, withApollo } from "react-apollo";
import gql from "graphql-tag";
const width = Dimensions.get("window").width;

class EditUserSlot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userSlot: {}
    };
  }
  componentDidMount() {
    console.log("component");
    const { userSlot } = this.props.navigation.state.params;
    console.log(userSlot, "dcgh");

    this.getUserSlot(userSlot.id);
  }
  updateuserSlot = async () => {
    const { userSlot } = this.state;

    const UPDATE_USERSLOT = await this.props.client.mutate({
      mutation: gql`
        mutation updateUserSlot($userSlot: UserSlotInput) {
          updateUserSlot(userSlot: $userSlot) {
            id
            user {
              id
            }
            confirmationCode
            status
          }
        }
      `,
      variables: { userSlot: this.state.userSlot }
    });
  };
  getUserSlot = async id => {
    console.log("method");
    const getUserSlot = await this.props.client.query({
      query: gql`
        query getUserSlotById($id: UUID) {
          getUserSlotById(id: $id) {
            id
            date
            confirmationCode
            status
            user {
              name
              id
              phone
            }
            doctorSlot {
              slotTime
              id
            }
            branch{id}
          }
        }
      `,
      variables: { id: id }
    });

    console.log("userslot", getUserSlot.data.getUserSlotById);
    const { userSlot } = getUserSlot.data.getUserSlotById;
    this.setState({ userSlot: getUserSlot.data.getUserSlotById });
  };
  render() {
    console.log(this.state.userSlot, "render");

    const { userSlot } = this.state;

    const { confirmationCode, date, user } = userSlot;
    return !_.isEmpty(userSlot) ? (
      <View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View
            style={{
              padding: 10,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ color: "#6699ff", fontSize: 25 }}>
              Edit UserSlot
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
              label="confirmationCode "
              value={confirmationCode}
              onChangeText={text =>
                this.setState(prevState => ({
                  ...prevState,
                  userSlot: { ...userSlot, confirmationCode: text }
                }))
              }
              placeholder="confirmationCode"
              style={styles.textInputContainerStyle}
            />
          </View>
          <View
            style={{
              padding: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              width: width / 3,
              alignItems: "center"
            }}
          >
            <Text>date : </Text>
            <DatePicker
              selected={date ? new Date(date) : null}
              onChange={cdate => {
                this.setState(prevState => ({
                  ...prevState,
                  userSlot: { ...userSlot, date: cdate }
                }));
              }}
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
              label="Phone Number"
              placeholder="Phone Number"
              value={userSlot.user.phone}
              onChangeText={text =>
                this.setState(prevState => ({
                  ...prevState,
                  userSlot: { ...userSlot, user: { ...user, phone: text } }
                }))
              }
              style={styles.textInputContainerStyle}
            />
          </View>

          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Button
              containerStyle={{ width: 100 }}
              title="save"
              onPress={() => {
                this.updateuserSlot();
              }}
            />
          </View>
        </View>
      </View>
    ) : null;
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
export default withApollo(EditUserSlot);
