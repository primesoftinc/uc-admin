import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  AsyncStorage,
  TouchableOpacity,
  TouchableHighlight
} from "react-native";
import MultiSelect from "react-native-multiple-select";
import gql from "graphql-tag";
import { Icon, Header, ListItem } from "react-native-elements";
import { Query, withApollo } from "react-apollo";
import Modal from "modal-react-native-web";

const width = Dimensions.get("window").width;

class TodayList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      branchId: "",
      modalVisible: false,
      selectedText: "",
      date: this.props.date,
      status: [],
      getAppointments: []
    };
    this.delete = this.delete.bind(this);
    this.retriveAppointments = this.retriveAppointments.bind(this);
  }
  delete = async id => {
    console.log(id);
    let data = await this.props.client.mutate({
      mutation: gql`
        mutation deleteDoctor($id: UUID) {
          deleteDoctor(id: $id)
        }
      `,
      variables: {
        id: id
      }
    });
  };
  setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };
  retriveAppointments = async () => {
    const getAppointments = await this.props.client.query({
      query: gql`
        query getAppointmentsByBranch($branchId: UUID, $date: String) {
          getAppointmentsByBranch(branchId: $branchId, date: $date) {
            id
            confirmationCode
            status
            cancelled
            user {
              name
              phone
            }
            doctorSlot {
              slotTime
            }
          }
        }
      `,
      variables: { branchId: this.state.branchId, date: this.state.date }
    });
    console.log(getAppointments.data.getAppointmentsByBranch, "getljhk");
    this.setState({
      getAppointments: getAppointments.data.getAppointmentsByBranch
    });
    getAppointments.data.getAppointmentsByBranch.map(arr => {
      this.state.status.push(arr.status);
    });
    console.log(this.state.status, "statusss");
  };
  saveStatus = async (status, id) => {
    console.log("save", id);
    await this.props.client.mutate({
      mutation: gql`
        mutation updateUserSlotStatus($status: String, $id: UUID) {
          updateUserSlotStatus(status: $status, id: $id)
        }
      `,
      variables: {
        status: status,
        id: id
      }
    });
  };
  async componentDidMount() {
    let branchId = await AsyncStorage.getItem("branchId");
    this.setState({
      branchId
    });
    this.retriveAppointments();
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  render() {
    let statusdata = [
      {
        value: "missed"
      },
      {
        value: "turnedup"
      },
      {
        value: "cancelled"
      },
      {
        value: "waiting"
      }
    ];
    console.log("yuhjl", this.state.date);

    const getAppointments = this.state.getAppointments;
    return (
      <ScrollView>
        <View>
          <Header
            centerComponent={{ text: "Home", style: { color: "#fff" } }}
            rightComponent={{ icon: "home", color: "#fff" }}
            leftComponent={
              <Icon
                name="arrow-back"
                color="#fff"
                onPress={() => {
                  console.log("adsfgw");
                  this.props.navigation.goBack(null);
                }}
              />
            }
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
            Appointment List
          </Text>
        </View>
        <ScrollView
          contentContainerStyle={{
            paddingLeft: width / 7
          }}
        >
          {getAppointments.map((l, i) => (
            <ListItem
              containerStyle={{
                shadowRadius: 5,
                shadowColor: "#5c5c5c",
                borderWidth: 1,
                width: (width * 2) / 3
              }}
              key={i}
              title={
                <Text style={{ paddingBottom: 15 }}>Name: {l.user.name}</Text>
              }
              subtitle={
                <View style={{ flexDirection: "column" }}>
                  <Text style={{ paddingBottom: 15 }}>
                    Phone Number: {l.user.phone}
                  </Text>
                  <Text style={{ paddingBottom: 15 }}>
                    Confirmation Code: {l.confirmationCode}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: width / 7
                    }}
                  >
                    <Text style={{ paddingBottom: 10 }}>Status :</Text>
                    <View style={{ width: width / 10 }}>
                      <MultiSelect
                        searchInputStyle={{ width: width / 10 }}
                        single={true}
                        items={statusdata}
                        uniqueKey={"value"}
                        displayKey={"value"}
                        selectText={this.state.status[i]}
                        selectedItems={this.state.status[i]}
                        onSelectedItemsChange={text => {
                          console.log("text", text);
                          let a = this.state.status.slice();
                          a[i] = text;
                          this.setState({ status: a });
                          this.saveStatus(text[0], l.id);
                        }}
                      />
                    </View>
                  </View>
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
                            userSlot: l
                          });
                        }}
                      />
                    </TouchableOpacity>
                    <View>
                      <Icon
                        name="assignment"
                        color="#00ccff"
                        onPress={() => {
                          console.log("on");
                          this.props.navigation.navigate("AddNotes", {
                            userSlot: l.id
                          });
                        }}
                      ></Icon>
                    </View>
                  </View>
                </View>
              }
            />
          ))}
        </ScrollView>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    backgroundColor: "lightblue",
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0
  }
});
export default withApollo(TodayList);
