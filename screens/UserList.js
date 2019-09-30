import React from "react";
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
import { Icon } from "react-native-elements";
import Header from "../util/Header";
import { Query, withApollo } from "react-apollo";
const width = Dimensions.get("window").width;

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      branchId: "",
      userList: []
    };
    this.delete = this.delete.bind(this);
  }
  async componentDidMount() {
    let branchId = await AsyncStorage.getItem("branchId");
    this.setState({ branchId });
    this.getUsersByBranch(branchId);
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
  getUsersByBranch = async id => {
    console.log(id);
    let res = await this.props.client.query({
      query: gql`
        query usersByBranchID($id: UUID) {
          usersByBranchID(id: $id) {
            user {
              name
              email
              phone
              isDeleted
              firstName
              lastName
              password
              address
              id
            }
          }
        }
      `,
      variables: {
        id: id
      }
    });
    this.setState({ userList: res.data.usersByBranchID });
  };
  render() {
    const { userList } = this.state;
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
            User List
          </Text>
        </View>
        <ScrollView
          contentContainerStyle={{
            paddingLeft: width / 7
          }}
        >
          {userList.map((l, i) => (
            <ListItem
              containerStyle={{
                shadowRadius: 5,
                shadowColor: "#5c5c5c",
                borderWidth: 1,
                width: (width * 2) / 3
              }}
              key={i}
              title={
                <Text style={{ paddingBottom: 10 }}>Name: {l.user.name}</Text>
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
                          this.props.navigation.navigate("FormikCreateUser", {
                            branchUser: l
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
