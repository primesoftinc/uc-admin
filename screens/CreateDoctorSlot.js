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
                console.log("in ok");

                generateTimeSlots(rowIndex);
              }}
            ></Button>
          </View>
        </View>
      );

    case 2:
      var uniqueDoctorSlots;
      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }
      if (rowIndex == 0) {
        console.log("in o ", doctorSlot);
        if (!_.isEmpty(doctorSlot)) {
          const doctorSlots = doctorSlot.map(s => s.slotTime);

          uniqueDoctorSlots = doctorSlots.filter(onlyUnique).sort();
          console.log("in o ", uniqueDoctorSlots);
        }
      } else {
        const doctor = cellData;
        if (!_.isEmpty(doctor.doctorSlot)) {
          const doctorSlots = doctor.doctorSlot.map(s => s.slotTime);
          uniqueDoctorSlots = doctorSlots.filter(onlyUnique).sort();
        }
      }

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
                //<View>
                <Button
                  //name="done"
                  //color="green"
                  title={"BUTTON"}
                  onPress={() => {
                    console.log("in addslot");
                    addSlot(rowIndex);
                    panel.close();
                    console.log("in addslo  22t");
                  }}
                />
                //</View>
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
      selectedItems: [],
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
  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
    this.slotsByDoctor(selectedItems);
    this.slotsForHospital(selectedItems);
  };
  onChangeToTime = value => {
    this.setState({ endTime: value });
  };
  onChangeFromTime = value => {
    this.setState({ startTime: value });
  };
  onChangeText = value => {
    this.setState({ interval: value });
  };
  onChangeSlot = value => {
    this.setState({ addSlot: value });
  };
  addSlot = rowIndex => {
    console.log("ib at ");
    const { selectedItems, doctorSlot, doctorList, addSlot } = this.state;
    var time = moment(addSlot).format("hh:mmA");
    console.log(typeof time, "timecc");
    var AdddoctorSlot = {
      slotTime: time,
      day: selectedItems[0],
      branch: { id: this.state.branchId }
    };
    if (rowIndex == 0) {
      console.log("in if ", rowIndex);
      doctorSlot.push(AdddoctorSlot);
      this.setState(doctorSlot);
    } else {
      var d = {
        ...doctorList[rowIndex - 1],
        doctorSlot: _.concat(doctorList[rowIndex - 1].doctorSlot, AdddoctorSlot)
      };
      console.log("addslot", d);
      doctorList[rowIndex - 1] = d;
      this.setState(doctorList);
    }

    console.log("addslot end", d);
  };
  generateTimeSlots = rowIndex => {
    console.log("generateTimeSlots");
    const { startTime, endTime, interval, branchId } = this.state;
    console.log(startTime, "start", endTime, interval);
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
      console.log("generateTimeSlots if at 1");

      if (startHours < endHours) {
        console.log("generateTimeSlots if at 2");

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
              day: selectedItems[j],
              branch: { id: branchId }
            };
            console.log(d);
            doctorSlots.push(d);
          }
          console.log("objects", doctorSlots);
          if (rowIndex == 0) {
            console.log("fdgh");
            this.setState({ doctorSlot: doctorSlots });
          }
          console.log("in", doctorSlots);

          doctor = { ...doctorList[rowIndex - 1], doctorSlot: doctorSlots };
          doctorList[rowIndex - 1] = doctor;
          this.setState({ doctorList });
        }
      }
    } else {
      console.log("generateTimeSlots else at 1");

      Alert.alert("plz fill");
    }
  };
  deleteSlot = (rowIndex, tagLabel, index) => {
    const { doctorList, doctorSlot } = this.state;
    var delid;
    const doctor = doctorList[rowIndex - 1];
    var d;
    if (rowIndex == 0) {
      delid = _.filter(doctorSlot, ds => {
        return ds.slotTime == tagLabel;
      });
      console.log("in delete if ", delid);

      d = _.remove(doctorSlot, ds => ds.slotTime != tagLabel);
    } else {
      delid = _.filter(doctorList[rowIndex - 1].doctorSlot, ds => {
        return ds.slotTime == tagLabel;
      });
      console.log("in delete ese ", delid[0].id);

      doctor.doctorSlot = _.remove(
        doctor.doctorSlot,
        s => s.slotTime != tagLabel
      );
    }

    this.deleteSlots(delid[0].id);
    this.setState({ doctorList, doctorSlot: d });
  };
  async componentDidMount() {
    let branchId = await AsyncStorage.getItem("branchId");
    this.DoctorList(branchId);
  }
  deleteSlots = async id => {
    console.log("in delete", id);
    // const { doctorList, doctorSlot } = this.state;
    // var id;
    // if (rowIndex != 0) id = doctorList[rowIndex - 1].doctorSlot[index].id;
    // else {
    //   id = doctorSlot[index].id;
    //   console.log(doctorSlot[index].id);
    // }
    // console.log("in delete22", id);

    if (!_.isEmpty(id)) {
      console.log("in delete11");

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
  DoctorList = async id => {
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
        id: id
      }
    });
    this.setState({ doctorList: res.data.getDoctorsByBranch, branchId });
  };

  slotsForHospital = async days => {
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
    this.setState({ doctorSlot: res.data.getSlots });
  };
  slotsByDoctor = async x => {
    const { doctorList } = this.state;
    let branchId = await AsyncStorage.getItem("branchId");
    var res = await this.props.client.query({
      query: gql`
        query getSlotsByDay($branchId: UUID, $day: [String]) {
          getSlotsByDay(day: $day, branchId: $branchId) {
            doctorName
            qualification
            id
            isDeleted
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
        branchId: branchId,
        day: x
      }
    });
    console.log(res.data.getSlotsByDay, "dgg");
    this.assignSlots(res.data.getSlotsByDay);
  };
  assignSlots = Slots => {
    const { doctorList } = this.state;
    if (Slots.length == 0) {
      doctorList.map((data, index) => {
        var doctors = { ...doctorList[index], doctorSlot: [] };
        doctorList[index] = doctors;
        this.setState({ doctorList });
      });
    } else {
      const ds = doctorList.map(doctor => {
        return {
          ...doctor,
          doctorSlot: []
        };
      });
      console.log("emptySlots", ds);
      this.setState({ doctorList: ds });
      ds.map((doctor, index) => {
        Slots.map(s => {
          if (doctor.id == s.id) {
            var doctors = { ...ds[index], doctorSlot: s.doctorSlot };
            ds[index] = doctors;
          }
        });
      });
      console.log("doctorslots123", ds);

      this.setState({ doctorList: ds });
    }
  };
  CreateDoctorSlot = async rowIndex => {
    if (rowIndex == 0) {
      const { doctorSlot } = this.state;
      await this.props.client.mutate({
        mutation: gql`
          mutation saveDoctorSlot($doctorSlots: [DoctorSlotInput]) {
            saveDoctorSlot(doctorSlots: $doctorSlots) {
              id
            }
          }
        `,
        variables: {
          doctorSlots: doctorSlot
        }
      });
    } else {
      const { doctorList } = this.state;
      console.log("create");
      await this.props.client.mutate({
        mutation: gql`
          mutation saveDoctor($doctor: DoctorInput) {
            saveDoctor(doctor: $doctor) {
              id
            }
          }
        `,
        variables: {
          doctor: doctorList[rowIndex - 1]
        }
      });
      console.log("sss");
    }
  };
  render() {
    const {
      selectedItems,
      doctorList,
      branchId,
      startTime,
      endTime
    } = this.state;

    const tableData = doctorList.map(rowObj => {
      const rowData = [rowObj.doctorName, "TIME_SETUP", rowObj];
      return rowData;
    });
    var tableArray = _.concat([this.Hospital], tableData);
    console.log("tableArray", doctorList);
    console.log("time ", startTime);
    console.log("doctorList", branchId);
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
            {tableArray.map((rowData, rowIndex) => (
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
