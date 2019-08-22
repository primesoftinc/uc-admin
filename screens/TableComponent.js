import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Table, TableWrapper, Row, Rows } from "react-native-table-component";
import { Button } from "react-native-elements";
import { ScrollView, Text, Alert, View } from "react-native";
import gql from "graphql-tag";
import ApolloClient from "apollo-boost";
const client = new ApolloClient({
  uri: "http://192.168.2.218:8080/graphql"
});
import { useQuery } from "@apollo/react-hooks";
const GET_USER_DETAILS = gql`
  {
    viewBranch {
      id
      branchName
      mobile
      code
    }
  }
`;
export default function HomeScreen() {
  const { loading, error, data } = useQuery(GET_USER_DETAILS);

  // client
  // .query({
  //   query: gql`
  //     {
  //       userDetails(id:"31000000-0000-0000-0000-000000000000"){
  //         id,
  //         name,
  //         email
  //       }
  //     }
  //   `
  // })
  // .then(result => console.log(result));

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{`Error! ${error.message}`}</Text>;
  else {
    return (
      <View>
        <ScrollView style={{ paddingTop: 30, borderBottomWidth: 1 }}>
          {data.viewBranch.map(d => {
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  borderTopWidth: 1,
                  borderLeftWidth: 1,
                  borderRightWidth: 1,
                  borderColor: "black"
                }}
              >
                <Text>{d.branchName}</Text>
                <Text>{d.code}</Text>

                <Text>{d.id}</Text>
              </View>
            );
          })}
        </ScrollView>
        <Button onPress={addRow} title="kjg" />
      </View>
    );
  }
}
function addRow() {
  Alert.alert("fh");
  return (
    <View style={{ borderWidth: 1, height: 500, backgroundColor: "red" }}>
      <Text>sdgf</Text>
    </View>
  );
}
