import React, { Component } from "react";
import { View, Text, TextInput } from "react-native";
import DatePicker from "../components/DatePicker";
import { Button } from "react-native-elements";
import CheckBox from "../components/CheckBox";
import "react-datepicker/dist/react-datepicker-cssmodules.css";

import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const add_UserSlot = gql`
  mutation saveUserSlot($date: String, $notes: String) {
    saveUserSlot(userSlot: { date: $date, notes: $notes }) {
      id
    }
  }
`;

export default class AddSlot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date()
    };
  }
  render() {
    return (
      <Mutation mutation={add_UserSlot}>
        {saveData => (
          <View>
            <View>
              <DatePicker />
            </View>
            <View>
              <TextInput
                label=""
                value={this.state.notes}
                onChangeText={text => this.setState({ notes: text })}
                placeholder="userId"
              />
            </View>
            <CheckBox />
            <View />
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Button
                containerStyle={{ width: 100 }}
                title="save"
                onPress={() => {
                  console.log("fhgk");
                  saveData({
                    variables: {
                      date: this.state.date,
                      userId: this.state.notes
                    }
                  }).then(() => {
                    return <Text>Sucess</Text>;
                  });
                  this.setState({ date: "", notes: "" });
                }}
              />
            </View>
          </View>
        )}
      </Mutation>
    );
  }
}
