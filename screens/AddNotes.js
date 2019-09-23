import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  AsyncStorage,
  Dimensions
} from "react-native";
import { Button } from "react-native-elements";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Header from "../util/Header";

const width = Dimensions.get("window").width;

const ADD_NOTES = gql`
  mutation updateUserSlotNotes($notes: String, $id: UUID) {
    updateUserSlotNotes(notes: $notes, id: $id)
  }
`;
export default class CreateRole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: "",
      id: ""
    };
  }

  componentDidMount() {
    this.setState({ id: this.props.navigation.state.params.userSlot });
  }
  render() {
    return (
      <View>
        <Header />
        <Mutation mutation={ADD_NOTES}>
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
                  Add Notes
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
                  label="Notes"
                  placeholder="Notes"
                  value={this.state.notes}
                  onChangeText={text => this.setState({ notes: text })}
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
                        notes: this.state.notes,
                        id: this.state.id
                      }
                    }).then(() => {
                      return <Text>Sucess</Text>;
                    });
                    this.setState({
                      notes: "",
                      id: ""
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
