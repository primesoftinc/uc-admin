import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  AsyncStorage,
  ScrollView,
  Dimensions,
  TouchableOpacity
} from "react-native";
import Tags from "react-native-tags";
import Header from "../util/Header";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker-cssmodules.css";

import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
//import TimePicker from "../components/TimePickerComponent ";
import { Button, CheckBox, Icon } from "react-native-elements";
import { Mutation, Query, withApollo } from "react-apollo";
import MultiSelect from "react-native-multiple-select";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell
} from "react-native-table-component";

import _ from "lodash";
import gql from "graphql-tag";

const element = (
  rowIndex,
  cellData,
  index,
  colors,
  toggleUnavailability,
  saveDoctorUnavailability,
  checkedArray,
  handleSelectAll,
  slotCount,
  slotsForHospital,
  totalCount
) => {
  switch (index) {
    case 0:
      var count = _.countBy(colors[rowIndex]);
      return (
        <View>
          <Text style={{ padding: 5, fontWeight: "bold" }}>{cellData}</Text>
          <View>
            <Text style={{ padding: 5 }}>
              Total No of slots:{" "}
              {slotCount[rowIndex] ? slotCount[rowIndex] : totalCount}
            </Text>
            <Text style={{ padding: 5, color: "green" }}>
              Available slots: {count.green ? count.green : 0}
            </Text>
            <Text style={{ padding: 5, color: "red" }}>
              Unavailable slots: {count.red ? count.red : 0}
            </Text>
          </View>
        </View>
      );
    case 1:
      var uniqueDoctorSlots;
      var c = [];
      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }
      if (rowIndex == colors.length) {
        console.log("if", colors.length);
        console.log("slotsForHospital", slotsForHospital);

        const doctorSlots = slotsForHospital.map(s => {
          slotsForHospital.map((ds, index) => {
            c[index] = "green";
            colors[rowIndex] = c;
          });
          return s.slotTime;
        });
        console.log("doctorSlots", doctorSlots);
        uniqueDoctorSlots = doctorSlots;
      } else {
        const doctor = cellData;
        const doctorSlots = doctor.doctorSlot.map(s => s.slotTime);
        uniqueDoctorSlots = doctorSlots.filter(onlyUnique);
      }
      return (
        <View>
          <View style={{ flexDirection: "column", justifyContent: "center" }}>
            <CheckBox
              center
              title="Select all"
              checked={checkedArray[rowIndex]}
              containerStyle={{
                width: 150,
                height: 20,
                paddingTop: 0,
                backgroundColor: "white",
                borderColor: "white",
                borderRadius: 1
              }}
              onPress={() => handleSelectAll(rowIndex)}
            />
          </View>
          <Tags
            initialTags={uniqueDoctorSlots}
            onChangeTags={tags => console.log(tags)}
            deleteTagOnPress={false}
            textInputProps={{ editable: false }}
            onTagPress={(index, tagLabel, event, deleted) => {
              console.log(
                index,
                tagLabel,
                event,
                cellData,
                rowIndex,
                deleted ? "deleted" : "not deleted"
              );
              console.log("BG color", colors[rowIndex][index]);
              toggleUnavailability(rowIndex, index, colors);
            }}
            inputStyle={{ backgroundColor: "white" }}
            renderTag={({
              tag,
              index,
              onPress,
              deleteTagOnPress,
              readonly
            }) => (
              <View>
                <TouchableOpacity
                  key={`${tag}-${index}`}
                  style={{ padding: 1 }}
                  onPress={onPress}
                >
                  <View
                    style={{
                      borderRadius: 20,
                      flexDirection: "row",
                      borderColor: colors[rowIndex][index],
                      borderWidth: 2
                    }}
                  >
                    <Text
                      style={{
                        padding: 7,

                        color: colors[rowIndex][index],
                        fontSize: 10
                      }}
                    >
                      {tag}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
          <View style={{ padding: 5 }}>
            <Button
              title="save"
              containerStyle={{
                width: 60,
                alignSelf: "center"
              }}
              onPress={() => {
                var indexArray = [];
                colors[rowIndex].map((c, index) => {
                  if (c == "red") {
                    indexArray.push(index);
                  }
                });
                console.log("selected Items", indexArray);
                saveDoctorUnavailability(rowIndex, indexArray);
              }}
            ></Button>
          </View>
        </View>
      );
  }
};

class CreateDoctorUnavailability extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      branchId: "",
      selectDate: new Date(),
      colors: [],
      date: new Date(),
      checkedArray: [],
      checked: false,
      timeSlot: [],
      doctorList: [{ doctorSlot: [] }],
      slotsForHospital: [],
      green: 0,
      red: [],
      slotCount: [],
      totalCount: 0
    };
    this.hospital = ["hospitalName", { doctorSlot: [] }];
    this.handleDate = this.handleDate.bind(this);

    this.Header = ["Doctor Name", "Doctor Slot"];
  }
  handleDate(date) {
    console.log("date", date);
    this.setState({
      selectDate: date
    });
  }
  handleSelectAll = index => {
    const { checkedArray, colors } = this.state;
    checkedArray[index] = !this.state.checkedArray[index];
    this.setState({ checkedArray: checkedArray });
    if (colors[index][0] == "green") {
      colors[index].fill("red");
    } else {
      colors[index].fill("green");
    }
  };
  toggleUnavailability = (rowIndex, index, colors) => {
    const { green, red } = this.state;
    const toggleColor = colors[rowIndex][index] == "green" ? "red" : "green";
    colors[rowIndex][index] = toggleColor;
    this.setState({ colors });
  };

  async componentDidMount() {
    let branchId = await AsyncStorage.getItem("branchId");
    this.setState({ branchId });
    var options = { weekday: "long" };
    let date = new Date();
    let day = Intl.DateTimeFormat("en-US", options).format(date);
    await this.doctorList(branchId, day);
    await this.slotsForHospital(day);
  }
  doctorList = async (id, day) => {
    // this.setState({ doctorList: [{ doctorSlot: [] }] }, () =>
    //   console.log("doctorListOsState", doctorList)
    // );
    const { colors, checked, checkedArray, doctorList, slotCount } = this.state;
    const res = await this.props.client.query({
      query: gql`
        query getSlotsByDoctor($branchId: UUID, $day: String) {
          getSlotsByDoctor(branchId: $branchId, day: $day) {
            doctorName
            doctorSlot {
              id
              slotTime
              day
            }
            branch {
              id
            }
          }
        }
      `,
      variables: {
        branchId: id,
        day: day
      }
    });
    console.log("doctorListqwe11", res.data.getSlotsByDoctor);
    res.data.getSlotsByDoctor.map((doctor, rowindex) => {
      var c = [];
      doctor.doctorSlot.map((ds, index) => {
        c[index] = "green";
        colors[rowindex] = c;
      });
      slotCount[rowindex] = doctor.doctorSlot.length;
      console.log("doctorListqwe", res.data.getSlotsByDoctor);
      this.setState({ slotCount, colors });
    });
    this.setState({ doctorList: res.data.getSlotsByDoctor, colors });
    res.data.getSlotsByDoctor.map((d, index) => {
      checkedArray[index] = false;
    });
    //this.slotsForHospital(day, res.data.getSlotsByDoctor);
  };

  saveDoctorUnavailability = (rowIndex, indexArray) => {
    const { doctorList, selectDate, branchId } = this.state;
    const unavailabledoctors = [];
    indexArray.map(index => {
      unavailabledoctors.push(doctorList[rowIndex].doctorSlot[index]);
    });
    console.log(" unavailabledoctors", unavailabledoctors);
    const dateFormat = moment(selectDate).format("DD-MM-YYYY");
    console.log("dateFormat", dateFormat);
    const ud = [];
    unavailabledoctors.map((doctorSlot, index) => {
      const loUnavailabledoctors = {
        branch: {
          id: branchId
        },
        doctorSlot: {
          id: doctorSlot.id
        },
        slot: doctorSlot.slotTime,
        day: doctorSlot.day,
        date: dateFormat
      };
      ud[index] = loUnavailabledoctors;
    });
    console.log(ud, "doctorUnavailablity");

    this.CreateDoctorUnavailability(ud);
  };
  CreateDoctorUnavailability = async unavailabledoctors => {
    console.log("in create", unavailabledoctors);
    await this.props.client.mutate({
      mutation: gql`
        mutation saveDoctorUnavailability(
          $doctorUnaivailability: [DoctorUnavailabilityInput]
        ) {
          saveDoctorUnavailability(
            doctorUnavailability: $doctorUnaivailability
          ) {
            id
          }
        }
      `,
      variables: {
        doctorUnaivailability: unavailabledoctors
      }
    });
  };

  slotsForHospital = async days => {
    const { doctorList } = this.state;
    console.log("console", doctorList);
    const loDoctorList = [...doctorList];
    // let dList = _.map(doctorList, ds => {
    //   if (ds.doctorName == "hospital") {
    //     _.remove(ds);
    //   }
    //   return ds;
    // });
    // console.log("dList", dList);
    // this.setState({ doctorList: dList });
    let branchId = await AsyncStorage.getItem("branchId");
    var res = await this.props.client.query({
      query: gql`
        query getSlots($branchId: UUID, $day: [String]) {
          getSlots(branchId: $branchId, day: $day) {
            slotTime
            day
            id
          }
        }
      `,
      variables: {
        branchId: branchId,
        day: days
      }
    });
    this.setState({ totalCount: res.data.getSlots.length });
    if (!_.isEmpty(res.data.getSlots)) {
      let length = loDoctorList.length;
      console.log("length", doctorList.length);
      loDoctorList[length] = {
        doctorName: "hospital",
        doctorSlot: res.data.getSlots
      };
    }

    this.setState({
      slotsForHospital: res.data.getSlots,
      doctorList: loDoctorList
    });
    console.log("colorsun", doctorList);
  };

  render() {
    const {
      colors,
      doctorList,
      selectDate,
      slotCount,
      branchId,
      slotsForHospital,
      checkedArray,
      totalCount
    } = this.state;

    const tableData =
      doctorList.length > 0
        ? doctorList.map(rowObj => {
            const rowData = [rowObj.doctorName, rowObj];
            return rowData;
          })
        : [];
    // var finaldata;
    // if (_.isEmpty(slotsForHospital)) {
    //   finaldata = tableData;
    // } else {
    //   finaldata = _.concat(tableData, [this.hospital]);
    // }
    var options = { weekday: "long" };
    console.log("indexArray");
    console.log("colors", colors);
    console.log("slotCount", tableData);

    return (
      <ScrollView>
        <Header />

        <DatePicker
          selected={this.state.selectDate}
          onChange={this.handleDate}
          dateFormat="yyyy/MM/dd"
        />
        <View>
          <Button
            title="submit"
            containerStyle={{
              width: 80,
              alignSelf: "center"
            }}
            onPress={async () => {
              let day = Intl.DateTimeFormat("en-US", options).format(
                selectDate
              );
              await this.doctorList(branchId, day);
              await this.slotsForHospital(day);
            }}
          />
        </View>
        <View style={{ padding: 30 }}></View>
        {_.isEmpty(doctorList)}
        <View style={styles.container}>
          <Table
            borderStyle={{
              borderColor: "black",
              borderWidth: 1
            }}
          >
            <Row
              data={this.Header}
              style={styles.head}
              textStyle={styles.text}
            ></Row>

            <Row textStyle={{ margin: 6 }} />
            {tableData.map((rowData, rowIndex) => (
              <TableWrapper key={rowIndex} style={styles.row}>
                {rowData.map((cellData, cellIndex) => (
                  <Cell
                    textStyle={styles.text}
                    key={cellIndex}
                    data={
                      tableData.length > 0
                        ? element(
                            rowIndex,
                            cellData,
                            cellIndex,
                            colors,
                            this.toggleUnavailability,
                            this.saveDoctorUnavailability,
                            checkedArray,
                            this.handleSelectAll,
                            slotCount,
                            slotsForHospital,
                            totalCount
                          )
                        : []
                    }
                  />
                ))}
              </TableWrapper>
            ))}
          </Table>
        </View>
      </ScrollView>
    );
  }
}
export default withApollo(CreateDoctorUnavailability);
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30 },
  head: { height: 40, backgroundColor: "#808B97" },
  textInputContainerStyle: {
    borderBottomWidth: 1,
    borderBottomColor: "#4e38fe",
    width: 400,
    padding: 10
  },
  styleTextDropdown: {
    colors: "#CCC",
    fontSize: 16,
    fontWeight: "normal"
  },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6 },
  row: { flexDirection: "row" }
});
