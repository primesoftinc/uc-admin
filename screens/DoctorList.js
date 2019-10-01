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
import { Query, withApollo } from "react-apollo";
import Header from "../util/Header";

const width = Dimensions.get("window").width;
class DoctorList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      branchId: "",
      doctorList: []
    };
    this.delete = this.delete.bind(this);
  }
  getDoctorsByBranch = async id => {
    console.log(id);
    let res = await this.props.client.query({
      query: gql`
        query getDoctorsByBranch($id: UUID) {
          getDoctorsByBranch(id: $id) {
            id
            doctorName
            qualification
          }
        }
      `,
      variables: {
        id: id
      }
    });
    this.setState({ doctorList: res.data.getDoctorsByBranch });
  };
  delete = async id => {
    console.log(id);
    let data = await this.props.client.mutate({
      mutation: gql`
        mutation deleteAsSafeDelete($id: UUID) {
          deleteAsSafeDelete(id: $id)
        }
      `,
      variables: {
        id: id
      }
    });
  };

  async componentDidMount() {
    let branchId = await AsyncStorage.getItem("branchId");
    this.setState({ branchId });
    this.getDoctorsByBranch(branchId);
  }
  render() {
    const { doctorList } = this.state;
    return (
      <View>
        <Header />
        <View>
          <Text
            style={{
              justifyContent: "center",
              alignSelf: "center",
              padding: 10,
              color: "#6699ff",
              fontSize: 25
            }}
          >
            Doctor List
          </Text>
        </View>
        <ScrollView
          contentContainerStyle={{
            paddingLeft: width / 7
          }}
        >
          {doctorList.map((l, i) => (
            <ListItem
              containerStyle={{
                shadowRadius: 5,
                shadowColor: "#5c5c5c",
                borderWidth: 1,
                width: (width * 2) / 3
              }}
              key={i}
              title={
                <Text style={{ paddingBottom: 10 }}>Name: {l.doctorName}</Text>
              }
              subtitle={
                <View style={{ flexDirection: "column" }}>
                  <Text style={{ paddingBottom: 10 }}>
                    Qualification: {l.qualification}
                  </Text>
                  <View
                    style={{
                      padding: 2,
                      justifyContent: "space-between",
                      flexDirection: "row",
                      width: width / 15
                    }}
                  >
                    {/* <TouchableOpacity>
                      <Icon
                        name="edit"
                        color="#00ccff"
                        onPress={() => {
                          this.props.navigation.navigate("EditForm", {
                            rowData: l.id
                          });
                        }}
                      />
                    </TouchableOpacity> */}
                    <TouchableOpacity>
                      <Icon
                        name="delete"
                        color="red"
                        onPress={() => {
                          this.delete(l.id);
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Icon
                        name="assignment"
                        color="#00ccff"
                        onPress={() => {
                          this.props.navigation.navigate(
                            "AppoinmentsByDoctor",
                            {
                              doctorId: l.id
                            }
                          );
                        }}
                      ></Icon>
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

export default withApollo(DoctorList);
