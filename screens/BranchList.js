import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity
} from "react-native";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import {
  Table,
  Row,
  Rows,
  Cell,
  TableWrapper
} from "react-native-table-component";
import { Icon } from "react-native-elements";
const GET_BRANCES_LIST = gql`
  {
    getBranch {
      branchName
      email
      code
      landPhone
      id
    }
  }
`;
const height = Dimensions.get("window").height;

export default function BranchList() {
  const { loading, error, data } = useQuery(GET_BRANCES_LIST);
  console.log(data);
  const head = ["Name", "email", "code", "landPhone", ""];
  // const data1 = [data.viewBranch]
  if (loading) return <Text>Loading</Text>;
  if (error) return <Text>{`Error! ${error.message}`}</Text>;
  console.log(data.getUsers);
  const tableData = data.getBranch.map(branch => {
    delete branch["id"];
    return Object.values(branch);
  });
  const element = (data, index) => (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <TouchableOpacity onPress={() => console.log("hgj")}>
        <View style={{ flex: 1 }}>
          <Icon name="edit" color="blue" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => console.log("hgj")}>
        <View style={{ flex: 1 }}>
          <Icon name="delete" color="blue" />
        </View>
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={styles.container}>
      <View
        style={{
          padding: 10,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text style={{ color: "#6699ff", fontSize: 25 }}>Branch List</Text>
      </View>
      <Table borderStyle={{ borderWidth: 1, borderColor: "#c8e1ff" }}>
        <Row data={head} style={styles.head} textStyle={styles.text} />

        {tableData.map((rowData, index) => (
          <TableWrapper key={index} style={styles.row}>
            {rowData.map((cellData, cellIndex) => (
              <Cell
                key={cellIndex}
                data={cellIndex === 4 ? element(cellData, index) : cellData}
                textStyle={styles.text}
              />
            ))}
          </TableWrapper>
        ))}

        {/* <Rows data={tableData} flexArr={[3, 2, 2, 2]} textStyle={styles.text} /> */}
      </Table>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: "#fff"
  },
  row: { flexDirection: "row", backgroundColor: "#ffffff" },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6 }
});
