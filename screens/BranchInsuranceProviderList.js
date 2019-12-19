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
import { ListItem, CheckBox, Button } from "react-native-elements";
import { Icon } from "react-native-elements";
import { Query, withApollo } from "react-apollo";
import Header from "../util/Header";

const width = Dimensions.get("window").width;
class BranchInsuranceProviderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      branchId: "",
      branchInsuranceProviderList: [],
      isActive: false,
      active: []
    };
  }
  getBranchInsuranceProviderByBranchId = async branchId => {
    console.log(branchId);
    let res = await this.props.client.query({
      query: gql`
        query getBranchInsuranceProviderByBranchId($branchId: UUID) {
          getBranchInsuranceProviderByBranchId(branchId: $branchId) {
            insuranceProvider {
              providerName
              id
            }
            isActive
            id
            branch {
              id
            }
          }
        }
      `,
      variables: {
        branchId: branchId
      }
    });

    let isActiveArr = res.data.getBranchInsuranceProviderByBranchId.map(l => {
      return l.isActive;
    });
    this.setState({
      branchInsuranceProviderList:
        res.data.getBranchInsuranceProviderByBranchId,
      active: isActiveArr
    });
  };
  saveProvider = async obj => {
    let res = await this.props.client.mutate({
      mutation: gql`
        mutation createBranchInsuranceProvider(
          $branchInsuranceProvider: BranchInsuranceProviderInput
        ) {
          createBranchInsuranceProvider(
            branchInsuranceProvider: $branchInsuranceProvider
          ) {
            id
          }
        }
      `,
      variables: {
        branchInsuranceProvider: obj
      }
    });
  };
  async componentDidMount() {
    let branchId = await AsyncStorage.getItem("branchId");
    this.setState({ branchId });
    this.getBranchInsuranceProviderByBranchId(branchId);
  }
  render() {
    const { branchInsuranceProviderList, active } = this.state;
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
          {branchInsuranceProviderList.map((l, i) => (
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
                  providerName: {l.insuranceProvider.providerName}
                </Text>
              }
              subtitle={
                <View style={{ flexDirection: "column" }}>
                  <CheckBox
                    containerStyle={{
                      width: 400,
                      padding: 10,
                      alignItems: "center"
                    }}
                    title="Is Active"
                    checked={active[i]}
                    onPress={() => {
                      let xx = [...this.state.active];
                      xx[i] = !xx[i];
                      this.setState({ active: xx });
                    }}
                  />
                  <Button
                    title="Save"
                    containerStyle={{
                      width: 80,
                      alignSelf: "flex-end"
                    }}
                    onPress={() => {
                      l.isActive = active[i];
                      this.saveProvider(l);
                    }}
                    /* loading={this.state.loading} */
                  />
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
                    {/* <TouchableOpacity>
                      <Icon
                        name="delete"
                        color="red"
                        onPress={() => {
                          //this.delete(l.id);
                        }}
                      />
                    </TouchableOpacity> */}
                    {/* <TouchableOpacity>
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
                    </TouchableOpacity> */}
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

export default withApollo(BranchInsuranceProviderList);
