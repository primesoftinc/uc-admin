import React, { Component } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { Table, Row, Rows } from "react-native-table-component";
const GET_BRANCh_DETAILS = gql`
  {
    getBranch {
      id
      branchName
      email
      code
      landPhone
    }
  }
`;
const width = Dimensions.get("window").width;

export default function ExampleOne() {
  const { loading, error, data } = useQuery(GET_BRANCh_DETAILS);
  console.log(data);
  const head = ["id", "branchName", "email", "code", "landPhone"];
  // const data1 = [data.viewBranch]
  if (loading) return <Text>Loading</Text>;
  if (error) return <Text>{`Error! ${error.message}`}</Text>;
  console.log(data.getUsers);
  const tableData = data.getBranch.map(rowObj => {
    delete rowObj["__typename"];
    return Object.values(rowObj);
  });
  return (
    <View style={styles.container}>
      <View
        style={{
          padding: 10,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text style={{ color: "#6699ff", fontSize: 25 }}>BranchList</Text>
      </View>
      <Table borderStyle={{ borderWidth: 1, borderColor: "#c8e1ff" }}>
        <Row
          data={head}
          style={styles.head}
          flexArr={[3, 2, 2, 2]}
          textStyle={styles.text}
        />

        <Rows data={tableData} flexArr={[3, 2, 2, 2]} textStyle={styles.text} />
      </Table>
    </View>
  );
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
