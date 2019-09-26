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

const format = "h:mm a";

const now = moment()
  .hour(0)
  .minute(0);

const element = (
  rowIndex,
  cellData,
  index,
  generateTimeSlots,
  deleteSlot,
  CreateDoctorSlot
) => {
  switch (index) {
    case 1:
      var startTime = "",
        endTime = "",
        interval = "";
      return (
        <View>
          <View style={{ padding: 5 }}>
            <TimePicker
              showSecond={false}
              defaultValue={now}
              onChange={value => {
                startTime = value;
              }}
              format={format}
              use12Hours
            ></TimePicker>
          </View>
          <View style={{ padding: 5 }}>
            <TimePicker
              showSecond={false}
              defaultValue={now}
              onChange={value => {
                endTime = value;
              }}
              format={format}
              use12Hours
            />
          </View>
          <View style={{ padding: 5 }}>
            <TextInput
              label="interval"
              placeholder="enter interval time"
              onChangeText={text => {
                interval = Number(text);
              }}
            ></TextInput>
          </View>
          <View style={{ alignSelf: "center", padding: 5 }}>
            <Button
              containerStyle={{ width: 100 }}
              title="ok"
              onPress={() => {
                generateTimeSlots(startTime, endTime, interval, rowIndex);
              }}
            ></Button>
          </View>
        </View>
      );

    case 2:
      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }
      const doctor = cellData;
      const doctorSlots = doctor.doctorSlot.map(s => s.slotTime);
      var uniqueDoctorSlots = doctorSlots.filter(onlyUnique);
      return (
        <View>
          <Tags
            initialTags={uniqueDoctorSlots}
            onChangeTags={tags => console.log(tags)}
            onTagPress={(index, tagLabel, event, deleted) => {
              console.log(
                index,
                tagLabel,
                event,
                cellData,
                rowIndex,
                deleted ? "deleted" : "not deleted"
              );
              deleteSlot(rowIndex, tagLabel, index);
            }}
            /* containerStyle={{
              justifyContent: "space-around"
            }} */
            inputStyle={{ backgroundColor: "white" }}
            renderTag={({
              tag,
              index,
              onPress,
              deleteTagOnPress,
              readonly
            }) => (
              <TouchableOpacity key={`${tag}-${index}`} style={{ padding: 1 }}>
                <View
                  style={{
                    borderRadius: 20,
                    flexDirection: "row",
                    borderColor: "blue",
                    borderWidth: 2
                  }}
                >
                  <Text
                    style={{
                      padding: 7,

                      color: "blue",
                      fontSize: 10
                    }}
                  >
                    {tag}
                  </Text>
                  <Icon name="cancel" color="blue" onPress={onPress}></Icon>
                </View>
              </TouchableOpacity>
            )}
          />
          <View style={{ padding: 5 }}>
            <Button
              title="save"
              containerStyle={{
                width: 80,
                alignSelf: "center"
              }}
              onPress={() => {
                CreateDoctorSlot(rowIndex);
              }}
            ></Button>
          </View>
        </View>
      );
  }
};

class CreateDoctorSlot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeSlot: [],
      selectedItems: [],
      doctorList: [{ doctorSlot: [] }]
    };
    this.week = [
      { name: "monday" },
      { name: "tuesday" },
      { name: "wednesday" },
      { name: "thursday" },
      { name: "friday" },
      { name: "saturday" },
      { name: "sunday" }
    ];
    this.Header = ["DoctorName", "TimeSetUp", "DoctorSlot"];
  }
  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
    this.slotsByDoctor(selectedItems);
  };
  onChangeToTime = value => {
    this.setState({ time: value });
  };
  generateTimeSlots = (startTime, endTime, interval, rowIndex) => {
    const { doctorList, selectedItems, timeSlot } = this.state;
    var startMinutes = startTime.minutes();
    var startHours = startTime.hours();
    var endHours = endTime.hours();
    var endMinutes = endTime.minutes();
    var doctorSlots = [];
    var doctor = [];
    var x = interval;
    var times = [];
    var tt = startHours * 60 + startMinutes;
    var ap = ["AM", "PM"];
    console.log(selectedItems.length, "seletd");
    for (var i = 0; tt < endHours * 60 + endMinutes; i++) {
      var hh = Math.floor(tt / 60);
      var mm = tt % 60;
      times[i] =
        ("00" + (hh % 12)).slice(-2) +
        ":" +
        ("0" + mm).slice(-2) +
        ap[Math.floor(hh / 12)];
      tt = tt + x;
      for (var j = 0; j < selectedItems.length; j++) {
        var d = {
          ...doctorSlots[i],
          slotTime: times[i],
          day: selectedItems[j]
        };
        doctorSlots.push(d);
      }
      console.log("in", doctorList);
      var newArray = _.concat(doctorSlots, doctorList.doctorSlot);
      // var newArray = doctorSlots.concat(doctorList.doctorSlot);
      console.log(newArray, "newArray");
      doctor = { ...doctorList[rowIndex], doctorSlot: doctorSlots };
      doctorList[rowIndex] = doctor;
      this.setState({ doctorList });
      timeSlot[rowIndex] = times;
      this.setState({ timeSlot });
    }
  };
  deleteSlot = (rowIndex, tagLabel, index) => {
    console.log("index", index);
    const { doctorList } = this.state;
    const doctor = doctorList[rowIndex];
    doctor.doctorSlot = _.remove(
      doctor.doctorSlot,
      s => s.slotTime != tagLabel
    );

    this.setState({ doctorList });
  };
  async componentDidMount() {
    let branchId = await AsyncStorage.getItem("branchId");
    this.DoctorList(branchId);
  }
  DoctorList = async id => {
    const res = await this.props.client.query({
      query: gql`
        query getDoctorsByBranch($id: UUID) {
          getDoctorsByBranch(id: $id) {
            doctorName
            qualification
            id
            doctorSlot {
              slotTime
              day
              id
            }
            branch {
              id
            }
          }
        }
      `,
      variables: {
        id: id
      }
    });
    this.setState({ doctorList: res.data.getDoctorsByBranch });
  };
  slotsByDoctor = async x => {
    const { doctorList } = this.state;
    console.log(x[0], "d");

    doctorList.map(async (d, index) => {
      var res = await this.props.client.query({
        query: gql`
          query getSlotsByDay($doctorId: UUID, $day: String) {
            getSlotsByDay(doctorId: $doctorId, day: $day) {
              slotTime
            }
          }
        `,
        variables: {
          doctorId: d.id,
          day: x[0]
        }
      });
      var doctor = { ...doctorList[index], doctorSlot: res.data.getSlotsByDay };
      doctorList[index] = doctor;
      this.setState({ doctorList });
    });
  };
  CreateDoctorSlot = async index => {
    const { doctorList } = this.state;
    await this.props.client.mutate({
      mutation: gql`
        mutation saveDoctor($doctor: DoctorInput) {
          saveDoctor(doctor: $doctor) {
            id
          }
        }
      `,
      variables: {
        doctor: doctorList[index]
      }
    });
    console.log("sss");
  };
  render() {
    const { selectedItems, doctorList } = this.state;
    const tableData = doctorList.map(rowObj => {
      const rowData = [rowObj.doctorName, "TIME_SETUP", rowObj];
      return rowData;
    });
    const { timeSlot } = this.state;

    console.log("adsf", timeSlot);
    console.log("doctorList", doctorList);
    return (
      <ScrollView>
        <Header />
        <View style={{ width: 300, alignSelf: "center" }}>
          <MultiSelect
            styleTextDropdown={styles.styleTextDropdown}
            styleDropdownMenuSubsection={{ borderBottomColor: "#4e38fe" }}
            styleListContainer={{ height: 140, width: 280 }}
            hideTags={false}
            items={this.week}
            uniqueKey={"name"}
            ref={component => {
              this.multiSelect = component;
            }}
            onSelectedItemsChange={this.onSelectedItemsChange}
            selectedItems={selectedItems}
            selectText="Select"
            styleTextDropdownSelected={{
              color: "#4e38fe",
              fontWeight: "normal"
            }}
            styleDropdownMenu={{
              paddingLeft: 10,
              paddingRight: 10,
              height: 100
            }}
            searchInputPlaceholderText="Search"
            searchInputStyle={{ width: 140 }}
            onChangeInput={component => {
              this.multiSelect = component;
            }}
            tagRemoveIconColor="#4e38fe"
            tagBorderColor="#4e38fe"
            tagTextColor="#4e38fe"
            selectedItemTextColor="#4e38fe"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            submitButtonColor="#4e38fe"
            submitButtonText="Submit"
          />
        </View>

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
                      cellIndex === 0
                        ? cellData
                        : element(
                            rowIndex,
                            cellData,
                            cellIndex,
                            this.generateTimeSlots,
                            this.deleteSlot,
                            this.CreateDoctorSlot
                          )
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
export default withApollo(CreateDoctorSlot);
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
    color: "#CCC",
    fontSize: 16,
    fontWeight: "normal"
  },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6 },
  row: { flexDirection: "row" }
});
