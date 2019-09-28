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
  handleSelectAll
) => {
  switch (index) {
    case 1:
      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }
      const doctor = cellData;
      const doctorSlots = doctor.doctorSlot.map(s => s.slotTime);
      var uniqueDoctorSlots = doctorSlots.filter(onlyUnique);
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
                      borderColor: colors,
                      borderWidth: 2
                    }}
                  >
                    <Text
                      style={{
                        padding: 7,

                        colors: colors,
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
                width: 80,
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
      selectDate: new Date(),
      colors: [],
      date: new Date(),
      checkedArray: [],
      checked: false,
      timeSlot: [],
      doctorList: [{ doctorSlot: [] }]
    };
    this.handleDate = this.handleDate.bind(this);

    this.Header = ["DoctorName", "DoctorSlot"];
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
    if (colors[0][0] == "green") {
      colors[index].fill("red");
    } else {
      colors.fill("green");
    }
  };
  toggleUnavailability = (rowIndex, index, colors) => {
    const toggleColor = colors[rowIndex][index] == "green" ? "red" : "green";
    colors[rowIndex][index] = toggleColor;
    this.setState({ colors });
  };

  async componentDidMount() {
    let branchId = await AsyncStorage.getItem("branchId");
    this.DoctorList(branchId);
  }
  DoctorList = async id => {
    const { colors, checked, checkedArray, doctorList } = this.state;
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
        branchId: "39a750f8-df55-4cea-9b3f-8438b0c1cd8a",
        day: "wednesday"
      }
    });
    this.setState({ doctorList: res.data.getSlotsByDoctor });
    res.data.getSlotsByDoctor.map((doctor, rowindex) => {
      var c = [];
      doctor.doctorSlot.map((ds, index) => {
        c[index] = "green";
        colors[rowindex] = c;
        this.setState({ colors });
      });
    });
    doctorList.map((d, index) => {
      checkedArray[index] = false;
    });
  };

  saveDoctorUnavailability = (rowIndex, indexArray) => {
    const { doctorList } = this.state;
    const unavailabledoctors = [];
    indexArray.map(index => {
      unavailabledoctors.push(doctorList[rowIndex].doctorSlot[index]);
    });
    console.log(" unavailabledoctors", unavailabledoctors);

    const ud = [];
    unavailabledoctors.map((doctorSlot, index) => {
      const loUnavailabledoctors = {};
      loUnavailabledoctors["doctorSlot"] = {};
      loUnavailabledoctors["branch"] = {};
      loUnavailabledoctors["slot"] = {};
      loUnavailabledoctors["day"] = {};

      loUnavailabledoctors.doctorSlot["id"] = {};
      loUnavailabledoctors.branch["id"] = {};

      loUnavailabledoctors.doctorSlot.id = doctorSlot.id;
      loUnavailabledoctors.branch.id = "39a750f8-df55-4cea-9b3f-8438b0c1cd8a";
      loUnavailabledoctors.slot = doctorSlot.slotTime;
      loUnavailabledoctors.day = doctorSlot.day;

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
  render() {
    const { colors, doctorList, selectDate } = this.state;

    const tableData = doctorList.map(rowObj => {
      const rowData = [rowObj.doctorName, rowObj];
      return rowData;
    });
    var options = { weekday: "long" };
    console.log("doctorList", doctorList);
    console.log("colors", colors);

    return (
      <ScrollView>
        <Header />

        <View>
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
              let day = Intl.DateTimeFormat("en-US", options).format(
                selectDate
              );
              console.log(day);
            }}
          />
        </View>
        <View style={{ padding: 30 }}></View>

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
                            this.state.colors,
                            this.toggleUnavailability,
                            this.saveDoctorUnavailability,
                            this.state.checkedArray,
                            this.handleSelectAll
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
