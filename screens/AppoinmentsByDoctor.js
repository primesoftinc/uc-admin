import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from "react-native";
import Header from "../util/Header";

import gql from "graphql-tag";
import { ListItem } from "react-native-elements";
import { Icon } from "react-native-elements";
import { Query, withApollo } from "react-apollo";
const GET_APPOINTMENTS = gql`
  query getAppointments($doctorId: UUID) {
    getAppointments(doctorId: $doctorId) {
      user {
        name
        phone
      }
      date
      doctorSlot {
        slotTime
      }
    }
  }
`;
const width = Dimensions.get("window").width;
class ListData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doctorId: this.props.navigation.state.params.doctorId
    };
  }
  render() {
    console.log(this.state.doctorId);
    return (
      <Query
        query={GET_APPOINTMENTS}
        variables={{ doctorId: this.state.doctorId }}
      >
        {({ loading, error, data }) => {
          if (loading) return <Text>Loading</Text>;
          if (error) return <Text>{`Error! ${error.message}`}</Text>;
          return (
            <View>
              <View>
                <Header />
                <Text
                  style={{
                    justifyContent: "center",
                    alignSelf: "center",
                    padding: 10,
                    color: "#6699ff",
                    fontSize: 25
                  }}
                >
                  Appoinment List
                </Text>
              </View>
              <ScrollView
                contentContainerStyle={{
                  paddingLeft: width / 7
                }}
              >
                {data.getAppointments.map((l, i) => (
                  <ListItem
                    containerStyle={{
                      shadowRadius: 5,
                      shadowColor: "#5c5c5c",
                      borderWidth: 1,
                      width: (width * 2) / 3
                    }}
                    key={i}
                    title={
                      <Text style={{ paddingBottom: 10 }}>
                        Name: {l.user.name}
                      </Text>
                    }
                    subtitle={
                      <View style={{ flexDirection: "column" }}>
                        <Text style={{ paddingBottom: 10 }}>
                          Date: {l.date}
                        </Text>
                        <Text style={{ paddingBottom: 10 }}>
                          slotTime: {l.doctorSlot.slotTime}
                        </Text>
                        <Text style={{ paddingBottom: 10 }}>
                          Phone Number: {l.user.phone}
                        </Text>

                        <View
                          style={{
                            padding: 2,
                            justifyContent: "space-between",
                            flexDirection: "row",
                            width: width / 15
                          }}
                        ></View>
                      </View>
                    }
                  />
                ))}
              </ScrollView>
            </View>
          );
        }}
      </Query>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: "#fff",
    width: width
  },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6 }
});

export default withApollo(ListData);
