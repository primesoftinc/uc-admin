import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { Query, withApollo } from "react-apollo";

import gql from "graphql-tag";
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

class BranchList extends React.Component {
  constructor(props) {
    super(props);
    this.element = this.element.bind(this);
    this._delete = this._delete.bind(this);
  }
  element = (data, index) => {
    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        <TouchableOpacity onPress={() => console.log(data)}>
          <View style={{ flex: 1 }}>
            <Icon name="edit" color="blue" />
          </View>
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Icon name="delete" color="blue" onPress={() => this._delete(data)} />
        </View>
      </View>
    );
  };
  _delete = async id => {
    console.log(id);
    let data = await this.props.client.mutate({
      mutation: gql`
        mutation deleteBranch($id: UUID) {
          deleteBranch(id: $id)
        }
      `,
      variables: {
        id: id
      }
    });
  };
  render() {
    return (
      <Query query={GET_BRANCES_LIST}>
        {({ loading, error, data }) => {
          console.log(data);
          const head = ["Name", "email", "code", "landPhone", "Action"];
          // const data1 = [data.viewBranch]
          if (loading) return <Text>Loading</Text>;
          if (error) return <Text>{`Error! ${error.message}`}</Text>;
          console.log(data.getUsers);
          const tableData = data.getBranch.map(branch => {
            delete branch["__typename"];
            return Object.values(branch);
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
                <Text style={{ color: "#6699ff", fontSize: 25 }}>
                  Branch List
                </Text>
              </View>
              <Table borderStyle={{ borderWidth: 1, borderColor: "#c8e1ff" }}>
                <Row data={head} style={styles.head} textStyle={styles.text} />

                {tableData.map((rowData, index) => (
                  <TableWrapper key={index} style={styles.row}>
                    {rowData.map((cellData, cellIndex) => (
                      <Cell
                        key={cellIndex}
                        data={
                          cellIndex === 4
                            ? this.element(cellData, index)
                            : cellData
                        }
                        textStyle={styles.text}
                      />
                    ))}
                  </TableWrapper>
                ))}
              </Table>
            </View>
          );
        }}
      </Query>
    );
  }
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
export default withApollo(BranchList);
