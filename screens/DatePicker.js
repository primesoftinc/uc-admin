import React from "react";
import DatePicker from "react-datepicker";
import { ListItem, Icon } from "react-native-elements";
import "react-datepicker/dist/react-datepicker.css";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from "react-native-web";
import gql from "graphql-tag";
import { Query, withApollo } from "react-apollo";

const width = Dimensions.get("window").width;

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

class DatePick extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fromDate: new Date(),
      toDate: new Date(),
      a: []
    };
    this.handleFromDate = this.handleFromDate.bind(this);
    this.handleToDate = this.handleToDate.bind(this);
    this.getListByDate = this.getListByDate.bind(this);
    this.listData = this.listData.bind(this);
  }

  handleFromDate(date) {
    this.setState({
      fromDate: date
    });
  }
  listData = () => {
    console.log("listdata");
    console.log(a, "aa");

    const { a } = this.state;
    return (
      <ScrollView>
        {a.map((l, i) => (
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
                        console.log("clicked");
                      }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Icon
                      name="assignment"
                      color="#00ccff"
                      onPress={() => {
                        this.props.navigation.navigate("AppoinmentsByDoctor", {
                          doctorId: l.id
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
    const { fromDate, toDate } = this.state;
    let res = await this.props.client.query({
      query: gql`
        query getAppointmentsBetweenDate($fromDate: String, $toDate: String) {
          getAppointmentsBetweenDate(fromDate: $fromDate, toDate: $toDate) {
            attended
            confirmationCode
            doctorSlot {
              slotTime
            }
            user {
              name
              phone
            }
          }
        }
      `,
      variables: {
        fromDate: fromDate,
        toDate: toDate
      }
    });
    console.log(res.data, "dataaaa");

    this.setState({ a: res.data.getAppointmentsBetweenDate });
  };
  handleToDate(date) {
    this.setState({
      toDate: date
    });
    this.getListByDate();
  }

  render() {
    const { a } = this.state;
    console.log(this.state.a, "ressss");
    return (
      <ScrollView>
        <View
          style={{
            padding: 10,
            justifyContent: "space-between",
            flexDirection: "row"
          }}
        >
          <Text>From:</Text>
          <DatePicker
            selected={this.state.fromDate}
            onChange={this.handleFromDate}
          />
          <Text>To:</Text>
          <DatePicker
            selected={this.state.toDate}
            onChange={this.handleToDate}
          />
        </View>
        <View>{this.listData()}</View>
      </ScrollView>
    );
  }
}
export default withApollo(DatePick);
