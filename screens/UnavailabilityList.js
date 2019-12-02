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
import { ListItem, Button } from "react-native-elements";
import { Icon } from "react-native-elements";
import Header from "../util/Header";
import DatePicker from "react-datepicker";
import moment from "moment";
import { Query, withApollo } from "react-apollo";
const width = Dimensions.get("window").width;

class UnavailabilityList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectDate: new Date(),
      branchId: "",
      unavailabilityList: [],
      slotsForHospital: []
    };
    this.handleDate = this.handleDate.bind(this);
  }
  handleDate(date) {
    console.log("date", date);
    this.setState({
      selectDate: date
    });
  }
  async componentDidMount() {
    let branchId = await AsyncStorage.getItem("branchId");
    let date = new Date();
    var options = { weekday: "long" };
    let day = Intl.DateTimeFormat("en-US", options).format(date);
    const dateFormat = moment(date).format("DD-MM-YYYY");
    this.setState({ branchId });
    await this.getDoctorUnavailabilityByBranch(branchId, dateFormat);
  }

  getDoctorUnavailabilityByBranch = async (id, date) => {
    console.log(id);
    let res = await this.props.client.query({
      query: gql`
        query getDoctorUnavailabilityByBranch($branchId: UUID, $date: String) {
          getDoctorUnavailabilityByBranch(branchId: $branchId, date: $date) {
            date
            doctorSlot {
              slotTime
              day
              doctor {
                doctorName
              }
            }
          }
        }
      `,
      variables: {
        branchId: id,
        date: date
      }
    });
    // this.setState({
    //   unavailabilityList: res.data.getDoctorUnavailabilityByBranch
    // });
    this.slotsForHospital(res.data.getDoctorUnavailabilityByBranch);
    console.log("actual", res.data.getDoctorUnavailabilityByBranch);
  };

  slotsForHospital = async unAvailabilityList => {
    // const { unavailabilityList } = this.state;

    const s = _.map(unAvailabilityList, (ds, index) => {
      const {
        doctorSlot: { doctor }
      } = ds;

      if (_.isEmpty(ds.doctorSlot.doctor)) {
        ds.doctorSlot.doctor = {
          doctorName: "hospital"
        };
        // ds = { ...ds, doctorSlot: { doctor: { doctorName: "hospital" } } };
      }
      return ds;
    });
    this.setState({ unavailabilityList: s });
    console.log("s", s);
  };

  render() {
    const { unavailabilityList, selectDate, branchId } = this.state;
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
            UnAvailability List
          </Text>
        </View>
        <Text style={{ paddingBottom: 10 }}>Select Date :</Text>
        <DatePicker
          selected={this.state.selectDate}
          onChange={this.handleDate}
          dateFormat="yyyy/MM/dd"
        />
        <Button
          title="submit"
          containerStyle={{
            width: 80,
            alignSelf: "center"
          }}
          onPress={() => {
            const dateFormat = moment(selectDate).format("DD-MM-YYYY");
            this.getDoctorUnavailabilityByBranch(branchId, dateFormat);
          }}
        />
        <ScrollView
          contentContainerStyle={{
            paddingLeft: width / 7
          }}
        >
          {unavailabilityList.map((l, i) => (
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
                  Name: {l.doctorSlot.doctor.doctorName}
                </Text>
              }
              subtitle={
                <View style={{ flexDirection: "column" }}>
                  <Text style={{ paddingBottom: 10 }}>
                    slotTime: {l.doctorSlot.slotTime}
                  </Text>
                  <Text style={{ paddingBottom: 10 }}>
                    Day: {l.doctorSlot.day}
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

export default withApollo(UnavailabilityList);
