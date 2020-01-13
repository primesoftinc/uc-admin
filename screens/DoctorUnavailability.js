import React, { Component } from "react";
import { View, Text, StyleSheet, AsyncStorage, ScrollView } from "react-native";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import "rc-time-picker/assets/index.css";
import { Button, CheckBox } from "react-native-elements";
import { withApollo } from "react-apollo";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import _ from "lodash";
import gql from "graphql-tag";

import Tag from "../components/Tag";
import Header from "../util/Header";

const element = (
  onCheck,
  cellData,
  index,
  addSlot,
  saveDoctorUnavailability
) => {
  const { availableSlots, unavailableSlots, doctorName, checked } = cellData;
  const slots = _.concat(availableSlots, unavailableSlots);
  switch (index) {
    case 0:
      return (
        <View>
          <Text style={{ padding: 5, fontWeight: "bold" }}>{doctorName}</Text>
          <View>
            <Text style={{ padding: 5 }}>
              Total No of slots:{" "}
              {availableSlots.length + unavailableSlots.length}
            </Text>
            <Text style={{ padding: 5, color: "green" }}>
              Available slots: {availableSlots.length}
            </Text>
            <Text style={{ padding: 5, color: "red" }}>
              Unavailable slots: {unavailableSlots.length}
            </Text>
          </View>
        </View>
      );
    case 1:
      return (
        <View>
          <View style={{ flexDirection: "column", justifyContent: "center" }}>
            <CheckBox
              center
              title="Select all"
              checked={checked}
              containerStyle={{
                width: 150,
                height: 20,
                paddingTop: 0,
                backgroundColor: "white",
                borderColor: "white",
                borderRadius: 1
              }}
              onPress={() => {
                onCheck(doctorName);
              }}
            />
          </View>
          <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
            {slots
              .sort((a, b) => (a.slotTime > b.slotTime ? 1 : -1))
              .map((ds, col) => {
                return (
                  <Tag
                    key={col}
                    value={moment(ds.slotTime, "HH:mm:ss").format("hh:mm A")}
                    onClick={() => addSlot(ds)}
                    ToggleColor={ds.isAvailable ? "green" : "red"}
                  />
                );
              })}
          </View>
          <View style={{ padding: 5 }}>
            <Button
              title="save"
              containerStyle={{
                width: 60,
                alignSelf: "center"
              }}
              onPress={() => {
                saveDoctorUnavailability(cellData);
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
      doctorList: [],
      green: 0,
      red: [],
      slotCount: [],
      unAvailableSlots: []
    };

    this.hospital = ["hospitalName", { doctorSlot: [] }];
    this.Header = ["Doctor Name", "Doctor Slot"];
    this.handleDate = this.handleDate.bind(this);
  }
  handleDate(date) {
    this.setState({
      selectDate: date
    });
  }

  addSlot = doctorSlot => {
    const { doctorList } = this.state;
    let d = [...doctorList];
    d.forEach(doctor => {
      if (doctorSlot.isAvailable) {
        doctor.availableSlots.forEach(element => {
          if (element.slotId == doctorSlot.slotId) {
            element.isAvailable = !element.isAvailable;
            doctor.unavailableSlots.push({ ...element, isChanged: true });
            _.remove(doctor.availableSlots, s => s.slotId == doctorSlot.slotId);
          } else element;
        });
      } else {
        doctor.unavailableSlots.forEach(un => {
          if (un.slotId == doctorSlot.slotId) {
            un.isAvailable = !un.isAvailable;
            doctor.availableSlots.push({ ...un, isChanged: true });
            _.remove(
              doctor.unavailableSlots,
              s => s.slotId == doctorSlot.slotId
            );
          } else un;
        });
      }
    });
    this.setState({ doctorList: d });
  };

  async componentDidMount() {
    let branchId = await AsyncStorage.getItem("branchId");
    this.setState({ branchId });
    let day = moment().format("dddd");
    await this.getSlotsFor(branchId, day);
  }

  saveDoctorUnavailability = cellData => {
    const { selectDate, branchId } = this.state;
    let vv = [];
    cellData.availableSlots.forEach(s => {
      if (s.isChanged) {
        vv.push(s);
      }
    });
    cellData.unavailableSlots.forEach(s => {
      if (s.isChanged) {
        vv.push(s);
      }
    });
    let withId = [];
    let withoutId = [];
    vv.map(v => {
      if (v.doctorUnavailablityId != null && v.isAvailable == true) {
        withId.push(v.doctorUnavailablityId);
      } else if (v.doctorUnavailablityId == null && v.isAvailable == false) {
        const loUnavailabledoctors = {
          branch: {
            id: branchId
          },
          doctorSlot: {
            id: v.slotId
          },
          slot: v.slotTime,
          day: moment(selectDate)
            .format("dddd")
            .toLowerCase(),
          date: moment(selectDate).format("DD-MM-YYYY")
        };
        withoutId.push(loUnavailabledoctors);
      }
    });
    this.CreateDoctorUnavailability(withoutId, withId);
  };

  CreateDoctorUnavailability = async (unavailabledoctors, availabledoctors) => {
    if (unavailabledoctors.length > 0) {
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
    }
    if (availabledoctors.length > 0) {
      await this.props.client.mutate({
        mutation: gql`
          mutation deleteDoctorUnavailability($ids: [UUID]) {
            deleteDoctorUnavailability(ids: $ids)
          }
        `,
        variables: {
          ids: availabledoctors
        }
      });
    }
  };

  getSlotsFor = async (branchId, days) => {
    console.log(" in s ", days);
    const { selectDate } = this.state;
    var res = await this.props.client.query({
      query: gql`
        query getSlotsFor($branchId: UUID, $day: String, $date: String) {
          getSlotsFor(branchId: $branchId, day: $day, date: $date) {
            doctorId
            doctorName
            availableSlots {
              slotId
              slotTime
              doctorUnavailablityId
              isAvailable
            }
            unavailableSlots {
              slotId
              slotTime
              doctorUnavailablityId
              isAvailable
            }
          }
        }
      `,
      variables: {
        branchId: branchId,
        day: days,
        date: moment(selectDate).format("DD-MM-YYYY")
      }
    });
    let doctorList = res.data.getSlotsFor.map(d => {
      return { ...d, checked: false };
    });
    this.setState({ doctorList: doctorList });
  };

  onCheck = doctorName => {
    const { doctorList } = this.state;
    let loDoctorList = [...doctorList];
    loDoctorList.forEach(d => {
      if (d.doctorName == doctorName) {
        d.checked = !d.checked;
        let allSlots = _.concat(d.availableSlots, d.unavailableSlots);
        let un = [];
        if (d.checked) {
          //if (doctorSlot.isAvailable) {

          allSlots.forEach(element => {
            element.isAvailable = false;
            un.push({ ...element, isChanged: true });
          });
          d.unavailableSlots = un;
          d.availableSlots = [];
        } else {
          allSlots.forEach(element => {
            element.isAvailable = true;
            un.push({ ...element, isChanged: true });
          });
          d.unavailableSlots = [];
          d.availableSlots = un;
        }
      }
    });
    this.setState({ doctorList: loDoctorList });
  };

  render() {
    const {
      colors,
      doctorList,
      selectDate,
      slotCount,
      branchId,
      checkedArray,
      unAvailableSlots
    } = this.state;

    const tableData = doctorList
      ? doctorList.map(doctor => {
          return [doctor, doctor];
        })
      : [];
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
              let day = moment(selectDate).format("dddd");
              //await this.slotsForHospital(branchId, day);
              await this.getSlotsFor(branchId, day);
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
                            this.onCheck,
                            cellData,
                            cellIndex,
                            this.addSlot,
                            this.saveDoctorUnavailability
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
