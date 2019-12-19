import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  AsyncStorage,
  TouchableOpacity
} from "react-native";
import gql from "graphql-tag";
import { ListItem } from "react-native-elements";
import { Icon } from "react-native-elements";
import { Query, withApollo } from "react-apollo";
import Header from "../util/Header";

const width = Dimensions.get("window").width;
class ProviderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      branchId: "",
      providerList: []
    };
    //this.delete = this.delete.bind(this);
  }
  getProviders = async () => {
    let res = await this.props.client.query({
      query: gql`
        query {
          getProviders {
            providerName
            id
            phoneNumber
          }
        }
      `
    });
    this.setState({ providerList: res.data.getProviders });
  };

  async componentDidMount() {
    let branchId = await AsyncStorage.getItem("branchId");
    this.setState({ branchId });
    this.getProviders();
  }
  render() {
    const { providerList } = this.state;
    return (
      <View>
        <Header />
        <View>
          <Text
            style={{
              justifyContent: "center",
              alignSelf: "center",
              padding: 10,
              color: "#6699ff",
              fontSize: 25
            }}
          >
            provider List
          </Text>
        </View>
        <ScrollView
          contentContainerStyle={{
            paddingLeft: width / 7
          }}
        >
          {providerList.map((l, i) => (
            <ListItem
              containerStyle={{
                shadowRadius: 5,
                shadowColor: "#5c5c5c",
                borderWidth: 1,
                width: (width * 2) / 3
              }}
              key={i}
              title={
                <Text style={{ paddingBottom: 10 }}>
                  Name: {l.providerName}
                </Text>
              }
              subtitle={
                <View style={{ flexDirection: "column" }}>
                  <Text style={{ paddingBottom: 10 }}>
                    Qualification: {l.phoneNumber}
                  </Text>
                  <View
                    style={{
                      padding: 2,
                      justifyContent: "space-between",
                      flexDirection: "row",
                      width: width / 15
                    }}
                  >
                    <TouchableOpacity>
                      <Icon
                        name="edit"
                        color="#00ccff"
                        onPress={() => {
                          this.props.navigation.navigate("InsuranceProvider", {
                            providerId: l.id
                          });
                        }}
                      ></Icon>
                    </TouchableOpacity>
                  </View>
                </View>
              }
            />
          ))}
        </ScrollView>
      </View>
    );
  }
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

export default withApollo(ProviderList);
