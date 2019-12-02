import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  AsyncStorage,
  ScrollView,
  Dimensions,
  Alert,
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
  CreateDoctorSlot,
  doctorSlot,
  onChangeFromTime,
  onChangeToTime,
  onChangeText,
  onChangeSlot,
  addSlot
) => {
  switch (index) {
    case 1:
      return (
        <View>
          <View style={{ padding: 5 }}>
            <TimePicker
              showSecond={false}
              defaultValue={now}
              onChange={value => {
                onChangeFromTime(value);
              }}
              format={format}
              focusOnOpen={true}
              use12Hours
            ></TimePicker>
          </View>
          <View style={{ padding: 5 }}>
            <TimePicker
              showSecond={false}
              defaultValue={now}
              onChange={value => onChangeToTime(value)}
              format={format}
              use12Hours
            />
          </View>
          <View style={{ padding: 5 }}>
            <TextInput
              label="interval"
              placeholder="enter interval time"
              onChangeText={text => {
                onChangeText(text);
              }}
            ></TextInput>
          </View>
          <View style={{ alignSelf: "center", padding: 5 }}>
            <Button
              containerStyle={{ width: 100 }}
              title="Ok"
              onPress={() => {
                generateTimeSlots(rowIndex);
              }}
            ></Button>
          </View>
        </View>
      );

    case 2:
      let uniqueDoctorSlots = [];
      uniqueDoctorSlots = cellData.doctorSlot
        .map(s => {
          return s.slotTime;
        })
        .sort();

      return (
        <View>
          <TimePicker
            showSecond={false}
            defaultValue={now}
            onChange={value => {
              onChangeSlot(value);
            }}
            addon={panel => {
              return (
                <Button
                  title={"BUTTON"}
                  onPress={() => {
                    addSlot(rowIndex);
                    panel.close();
                  }}
                />
              );
            }}
            format={format}
            use12Hours
          ></TimePicker>
          <Tags
            initialTags={uniqueDoctorSlots}
            onChangeTags={tags => console.log(tags)}
            textInputProps={{ editable: false }}
            onTagPress={(index, tagLabel, event, deleted) => {
              deleteSlot(rowIndex, tagLabel, index);
            }}
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
                    {moment(tag, "HH:mm").format("hh:mm A")}
                  </Text>
                  <Icon name="cancel" color="blue" onPress={onPress}></Icon>
                </View>
              </TouchableOpacity>
            )}
          />
          <View style={{ padding: 5 }}>
            <Button
              title="Save"
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
      branchId: "",
      doctorSlot: [],
      selectedItems: [moment().format("dddd")],
      startTime: "",
      endTime: "",
      interval: "",
      addSlot: "",
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
    this.Header = ["Doctor Name", "Time Setup", "Doctor Slot"];
    this.Hospital = ["HospitalName", "TimeSetUp", { doctorSlot: [] }];
  }

  //selecting day
  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
    this.DoctorList(selectedItems);
  };

  //change toTime
  onChangeToTime = value => {
    this.setState({ endTime: value });
  };

  //change From time
  onChangeFromTime = value => {
    this.setState({ startTime: value });
  };

  //onChange for interval
  onChangeText = value => {
    this.setState({ interval: value });
  };

  //selecting time without using generation method
  onChangeSlot = value => {
    this.setState({ addSlot: value });
  };

  //on CLick for time picker
  addSlot = rowIndex => {
    const { selectedItems, doctorList, addSlot } = this.state;
    var time = moment(addSlot, "hh:mm A").format("HH:mm");
    var AdddoctorSlot = {
      slotTime: time,
      day: selectedItems[0],
      branch: { id: this.state.branchId }
    };
    var d = {
      ...doctorList[rowIndex],
      doctorSlot: _.concat(doctorList[rowIndex].doctorSlot, AdddoctorSlot)
    };
    doctorList[rowIndex] = d;
    this.setState(doctorList);
  };

  //generating slots between the given time
  generateTimeSlots = rowIndex => {
    const { startTime, endTime, interval, branchId } = this.state;
    if (!_.isEmpty(interval)) {
      const { doctorList, selectedItems, timeSlot } = this.state;
      var startMinutes = startTime.minutes();
      var startHours = startTime.hours();
      var endHours = endTime.hours();
      var endMinutes = endTime.minutes();
      var doctorSlots = [];
      var doctor = [];
      var x = Number(interval);
      var times = [];
      var tt = startHours * 60 + startMinutes;
      var ap = ["AM", "PM"];

      if (startHours < endHours) {
        for (var i = 0; tt < endHours * 60 + endMinutes; i++) {
          var hh = Math.floor(tt / 60);
          var mm = tt % 60;
          times[i] =
            ("00" + (hh % 12)).slice(-2) +
            ":" +
            ("0" + mm).slice(-2) +
            " " +
            ap[Math.floor(hh / 12)];
          tt = tt + x;
          for (var j = 0; j < selectedItems.length; j++) {
            var d = {
              ...doctorSlots[i],
              slotTime: moment(times[i], "hh:mm A").format("HH:mm"),
              day: selectedItems[j],
              branch: { id: branchId }
            };
            doctorSlots.push(d);
          }
          if (rowIndex == 0) {
            this.setState({ doctorSlot: doctorSlots });
          }

          doctor = { ...doctorList[rowIndex], doctorSlot: doctorSlots };
          doctorList[rowIndex] = doctor;
          this.setState({ doctorList });
        }
      }
    } else {
      Alert.alert("plz fill");
    }
  };

  //deleting the slot from ui
  deleteSlot = (rowIndex, tagLabel, index) => {
    const { doctorList, doctorSlot } = this.state;
    var delid;
    const doctor = doctorList[rowIndex];
    var d;

    delid = _.filter(doctorList[rowIndex].doctorSlot, ds => {
      return ds.slotTime == tagLabel;
    });

    doctor.doctorSlot = _.remove(
      doctor.doctorSlot,
      s => s.slotTime != tagLabel
    );

    this.deleteSlots(delid[0].id);
    this.setState({ doctorList, doctorSlot: d });
  };

  //returns true if the id is in the given list(doctors)
  isADoctor(doctors, id) {
    let count = 0;
    doctors.map(d => {
      if (d.id == id) {
        count++;
      }
    });
    if (count > 0) return true;
    else return false;
  }

  //Componentdidmount
  async componentDidMount() {
    const { selectedItems } = this.state;
    this.DoctorList(selectedItems);
  }

  //delete from database
  deleteSlots = async id => {
    if (!_.isEmpty(id)) {
      await this.props.client.mutate({
        mutation: gql`
          mutation deleteById($id: UUID) {
            deleteById(id: $id)
          }
        `,
        variables: {
          id: id
        }
      });
    }
  };

  //To get all the doctors for the branch and has another api call for slots by day
  DoctorList = async day => {
    let branchId = await AsyncStorage.getItem("branchId");
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
            user {
              id
            }
          }
        }
      `,
      variables: {
        id: branchId
      }
    });
    this.setState({ doctorList: res.data.getDoctorsByBranch, branchId });
    this.slotsForHospital(res.data.getDoctorsByBranch, branchId, day);
  };

  //To get the slots for the given day
  slotsForHospital = async (doctors, branchId, days) => {
    const { doctorList } = this.state;
    var res = await this.props.client.query({
      query: gql`
        query getSlots($branchId: UUID, $day: [String]) {
          getSlots(branchId: $branchId, day: $day) {
            slotTime
            day
            id
            doctor {
              id
              doctorName
              doctorSpecializations {
                specialization {
                  specializtionName
                }
              }
            }
            branch {
              id
              branchName
              timeZone
            }
          }
        }
      `,
      variables: {
        branchId: branchId,
        day: days
      }
    });

    let doctorSlotsGrouped = {};
    doctorSlotsGrouped = _.groupBy(res.data.getSlots, ds =>
      ds.doctor ? ds.doctor.id : "branch"
    );
    doctorList.map(d => {
      d.doctorSlot = [];
    });
    let allSlots = [];
    let v = {};

    if (Object.keys(doctorSlotsGrouped).includes("branch")) {
      _.map(doctorSlotsGrouped, (value, key) => {
        if (key == "branch") {
          v = { doctorName: "All Sots", doctorSlot: value };
        }
      });
    } else {
      v = { doctorName: "All slots", doctorSlot: [] };
    }
    doctors.map((d, index) => {
      _.map(doctorSlotsGrouped, (value, key) => {
        if (d.id == key) {
          var dd = { ...doctorList[index], doctorSlot: value };
          doctorList[index] = dd;
        }
      });
    });
    allSlots = _.concat(v, doctorList);
    this.setState({ doctorList: allSlots });
  };

  //To store the generated slots in databse
  CreateDoctorSlot = async rowIndex => {
    if (rowIndex == 0) {
      const { doctorSlot, doctorList } = this.state;
      await this.props.client.mutate({
        mutation: gql`
          mutation saveDoctorSlot($doctorSlots: [DoctorSlotInput]) {
            saveDoctorSlot(doctorSlots: $doctorSlots) {
              id
            }
          }
        `,
        variables: {
          doctorSlots: doctorList[rowIndex].doctorSlot
        }
      });
    } else {
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
          doctor: doctorList[rowIndex]
        }
      });
    }
  };

  render() {
    const {
      selectedItems,
      doctorList,
      branchId,
      startTime,
      doctorSlot
    } = this.state;

    const tableData = doctorList.map(rowObj => {
      const rowData = [rowObj.doctorName, "TIME_SETUP", rowObj];
      return rowData;
    });

    return (
      <ScrollView>
        <Header />
        <View style={{ width: 300, alignSelf: "center" }}>
          <MultiSelect
            styleTextDropdown={styles.styleTextDropdown}
            styleDropdownMenuSubsection={{ borderBottomColor: "#4e38fe" }}
            styleListContainer={{ height: 140, width: 280 }}
            hideTags={false}
            single={true}
            items={this.week}
            uniqueKey={"name"}
            displayKey={"name"}
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
                            this.CreateDoctorSlot,
                            this.state.doctorSlot,
                            this.onChangeFromTime,
                            this.onChangeToTime,
                            this.onChangeText,
                            this.onChangeSlot,
                            this.addSlot
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
