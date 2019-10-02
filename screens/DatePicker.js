import React from "react";
import DatePicker from "react-datepicker";
import { ListItem, Icon, Button } from "react-native-elements";

import {
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  AsyncStorage
} from "react-native-web";
import gql from "graphql-tag";
import { Query, withApollo } from "react-apollo";

const width = Dimensions.get("window").width;

// CSS Modules, react-datepicker-cssmodules.css
import "react-datepicker/dist/react-datepicker-cssmodules.css";

class DatePick extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fromDate: new Date(),
      toDate: new Date(),
      getAppointmentsBetweenDate: []
    };
    this.handleFromDate = this.handleFromDate.bind(this);
    this.handleToDate = this.handleToDate.bind(this);
    this.getListByDate = this.getListByDate.bind(this);
    this.listData = this.listData.bind(this);
  }
  async componentDidMount() {
    let branchId = await AsyncStorage.getItem("branchId");
    this.setState({
      branchId
    });
  }
  handleFromDate(date) {
    console.log("Fro date", date);
    this.setState({
      fromDate: date
    });
  }
  listData = () => {
    console.log("listdata");
    console.log(getAppointmentsBetweenDate, "aa");

    const { getAppointmentsBetweenDate } = this.state;
    return (
      <ScrollView>
        {getAppointmentsBetweenDate.map((l, i) => (
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
                  Phone Number: {l.user.phone}
                </Text>
                <Text style={{ paddingBottom: 10 }}>
                  confirmationCode: {l.confirmationCode}
                </Text>
                <Text style={{ paddingBottom: 10 }}>date: {l.date}</Text>
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
                  <TouchableOpacity>
                    <Icon
                      name="delete"
                      color="red"
                      onPress={() => {
                        console.log("clicked");
                      }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
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
                  </TouchableOpacity>
                </View>
              </View>
            }
          />
        ))}
      </ScrollView>
    );
  };
  getListByDate = async () => {
    const { fromDate, toDate, branchId } = this.state;
    let res = await this.props.client.query({
      query: gql`
        query getAppointmentsBetweenDate(
          $fromDate: String
          $toDate: String
          $branchId: UUID
        ) {
          getAppointmentsBetweenDate(
            fromDate: $fromDate
            toDate: $toDate
            branchId: $branchId
          ) {
            attended
            id
            confirmationCode
            date
            doctorSlot {
              slotTime
            }
            user {
              name
              phone
            }
            branch {
              id
            }
          }
        }
      `,
      variables: {
        fromDate: fromDate,
        toDate: toDate,
        branchId: branchId
      }
    });
    console.log(res.data, "dataaaa");

    this.setState({
      getAppointmentsBetweenDate: res.data.getAppointmentsBetweenDate
    });
  };
  handleToDate(date) {
    this.setState({
      toDate: date
    });
  }

  render() {
    return (
      <ScrollView>
        <View
          style={{
            padding: 10,
            flex: 1,
            justifyContent: "center",
            flexDirection: "row"
          }}
        >
          <View
            style={{
              flex: 0.4,
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <Text>From:</Text>
            <View>
              <DatePicker
                selected={this.state.fromDate}
                onChange={this.handleFromDate}
                dateFormat="yyyy/MM/dd"
              />
            </View>
            <Text>To:</Text>
            <DatePicker
              selected={this.state.toDate}
              onChange={this.handleToDate}
              dateFormat="yyyy/MM/dd"
            />
          </View>
        </View>
        <View>
          <Button
            title="ok"
            containerStyle={{ width: 100, alignSelf: "center" }}
            onPress={() => {
              this.getListByDate();
            }}
          ></Button>
        </View>
        <View style={{ paddingLeft: width / 7, paddingTop: 10 }}>
          {this.listData()}
        </View>
      </ScrollView>
    );
  }
}
export default withApollo(DatePick);
