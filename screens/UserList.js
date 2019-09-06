import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  AsyncStorage,
  TouchableOpacity
} from "react-native";
import gql from "graphql-tag";
import { ListItem } from "react-native-elements";
import { Icon, Header } from "react-native-elements";
import { Query, withApollo } from "react-apollo";
const width = Dimensions.get("window").width;
const GET_USERS_LIST = gql`
  query usersByBranchID($id: UUID) {
    usersByBranchID(id: $id) {
      user {
        name
        email
        phone
        firstName
        lastName
        password
        address
        id
      }
    }
  }
`;
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      branchId: ""
    };
    this.delete = this.delete.bind(this);
  }
  componentDidMount() {
    AsyncStorage.getItem("branchId").then(value => {
      this.setState({ branchId: value });
    });
  }

  delete = async id => {
    console.log(id);
    let data = await this.props.client.mutate({
      mutation: gql`
        mutation deleteUser($id: UUID) {
          deleteUser(id: $id)
        }
      `,
      variables: {
        id: id
      }
    });
  };

  render() {
    return (
      <Query query={GET_USERS_LIST} variables={{ id: this.state.branchId }}>
        {({ loading, error, data }) => {
          if (loading) return <Text>Loading</Text>;
          if (error) return <Text>{`Error! ${error.message}`}</Text>;
          console.log(data);
          return (
            <View>
              <View>
                <Header
                  centerComponent={{ text: "Home", style: { color: "#fff" } }}
                  rightComponent={{ icon: "home", color: "#fff" }}
                />
                <Text
                  style={{
                    justifyContent: "center",
                    alignSelf: "center",
                    padding: 10,
                    color: "#6699ff",
                    fontSize: 25
                  }}
                >
                  User List
                </Text>
              </View>
              <ScrollView
                contentContainerStyle={{
                  paddingLeft: width / 7
                }}
              >
                {data.usersByBranchID.map((l, i) => (
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
                          Email: {l.user.email}
                        </Text>
                        <Text style={{ paddingBottom: 10 }}>
                          Phone Number: {l.user.phone}
                        </Text>
                        <Text style={{ paddingBottom: 10 }}>Slot: 10:30</Text>
                        <View
                          style={{
                            padding: 2,
                            justifyContent: "space-between",
                            flexDirection: "row",
                            width: width / 15
                          }}
                        >
                          <TouchableOpacity>
                            <Icon
                              name="edit"
                              color="#00ccff"
                              onPress={() => {
                                this.props.navigation.navigate("EditForm", {
                                  rowData: l
                                });
                              }}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity>
                            <Icon
                              name="delete"
                              color="red"
                              onPress={() => {
                                this.delete(l.user.id);
                              }}
                            />
                          </TouchableOpacity>
                        </View>
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

export default withApollo(UserList);
