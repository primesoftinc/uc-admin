import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
const add_DoctorSlot = gql`
  mutation doctorSlot($day: String, $slotTime: String, $doctorId: UUID) {
    doctorSlot(
      doctorSlot: { day: $day, slotTime: $slotTime, doctor: { id: $doctorId } }
    ) {
      id
    }
  }
`;
export default class CreateBranch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      day: "",
      slotTime: "",
      doctorId: ""
    };
  }

  render() {
    return (
      <View>
        <Mutation mutation={add_DoctorSlot}>
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
                  Add DoctorSlot
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
                  label="Day"
                  placeholder="Day"
                  value={this.state.day}
                  onChangeText={text => this.setState({ day: text })}
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
                  label="SlotTime"
                  value={this.state.slotTime}
                  onChangeText={text => this.setState({ slotTime: text })}
                  placeholder="SlotTime"
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
                  label="doctorId"
                  value={this.state.doctorId}
                  onChangeText={text => this.setState({ doctorId: text })}
                  placeholder="doctorId"
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
                        day: this.state.day,
                        slotTime: this.state.slotTime,
                        doctorId: this.state.doctorId
                      }
                    }).then(() => {
                      return <Text>Sucess</Text>;
                    });
                    this.setState({
                      day: "",
                      slotTime: "",
                      doctorId: ""
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
