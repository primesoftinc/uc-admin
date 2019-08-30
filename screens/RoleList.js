import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView
} from "react-native";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
const ROLES_LIST = gql`
  query {
    getRolesList {
      roleName
    }
  }
`;
export default function RoleList() {
  const { loading, error, data } = useQuery(ROLES_LIST);
  console.log(data);
  const head = ["Name"];
  if (loading) return <Text>Loading</Text>;
  if (error) return <Text>{`Error! ${error.message}`}</Text>;
  console.log(data.getRolesList);
  const tableData = data.getRolesList.map(branch => {
    delete branch["__typename"];
    return Object.values(branch);
  });

  const element = (data, index) => (
    <TouchableOpacity onPress={() => console.log(index + "" + data)}>
      <View style={styles.btn}>
        <Text style={styles.btnText}>button</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView>
      <ScrollView horizontal={true} directionalLockEnabled={false}>
        <View style={styles.container}>
          <View
            style={{
              padding: 10,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ color: "#6699ff", fontSize: 25 }}>RoleList</Text>
          </View>
          <Table borderStyle={{ borderWidth: 1, borderColor: "#c8e1ff" }}>
            <Row
              data={head}
              style={styles.head}
              flexArr={[2, 2, 2, 2, 2]}
              textStyle={styles.text}
            />

            {tableData.map((rowData, index) => (
              <TableWrapper
                flexArr={[2, 2, 2, 2, 2]}
                key={index}
                style={styles.row}
              >
                {rowData.map((cellData, cellIndex) => (
                  <Cell
                    key={cellIndex}
                    data={cellIndex === 1 ? element(cellData, index) : cellData}
                    textStyle={styles.text}
                  />
                ))}
              </TableWrapper>
            ))}

            {/* <Rows
              data={tableData}
              flexArr={[2, 2, 2, 2, 2]}
              textStyle={styles.text}
            /> */}
          </Table>
        </View>
      </ScrollView>
    </ScrollView>
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
