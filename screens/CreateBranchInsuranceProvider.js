import React, { Component } from "react";
import { Mutation, withApollo } from "react-apollo";
import gql from "graphql-tag";
import { Formik, Field } from "formik";
import Header from "../util/Header";
import { Input, Button } from "react-native-elements";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  AsyncStorage,
  ScrollView
} from "react-native";
import _ from "lodash";
import Toast, { DURATION } from "react-native-easy-toast";
import { FormikMultiSelect } from "../components/FormikMultiSelect";

class CreateBranchInsuranceProvider extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      provider: [],
      branchId: "",
      position: "top"
    };
  }
  onClick = (text, position, duration, withStyle) => {
    this.setState({
      position: position
    });
    if (withStyle) {
      this.refs.toastWithStyle.show(text, duration);
    } else {
      this.refs.toast.show(text, duration);
    }
  };

  _getProviderName = async () => {
    const { provider } = this.state;
    var providerName = await this.props.client.query({
      query: gql`
        query {
          getProviders {
            id
            providerName
          }
        }
      `
    });
    this.setState({ provider: providerName.data.getProviders });
    console.log("object", providerName);
  };

  async componentDidMount() {
    // const { branchUser } = this.props.navigation.state.params;
    let branchId = await AsyncStorage.getItem("branchId");
    this.setState({ branchId });
    await this._getProviderName();
  }

  _renderForm = props => {
    const { provider } = this.state;
    const { values } = props;

    return (
      <View
        style={{
          width: 400,
          padding: 10,
          padding: 10,
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center"
        }}
      >
        <Text style={{ color: "#6699ff", fontSize: 25 }}>
          Create Branch Insurance Provider
        </Text>

        <View style={{ flexDirection: "row" }}>
          <View style={{ paddingTop: 40 }}>
            <Text style={{ fontSize: 15 }}>Select Provider:</Text>
          </View>
          {provider && provider.length > 0 ? (
            <View>
              <Field
                name="branchInsuranceProvider.insuranceProvider.id"
                uniqueKey="id"
                single={true}
                displayKey="providerName"
                component={FormikMultiSelect}
                data={provider}
                selectedItems={_.get(
                  values,
                  "branchInsuranceProvider.insuranceProvider.id",
                  []
                )}
              />
            </View>
          ) : null}
        </View>

        <Button onPress={props.handleSubmit} title="Submit" />
      </View>
    );
  };

  render() {
    return (
      <ScrollView>
        <Header></Header>
        <Mutation
          mutation={CREATE_BRANCH_INSURANCE_PROVIDER}
          onCompleted={data => {
            if (data) {
              this.onClick("save succesfulll", "top", 500, false);
            }
          }}
          onError={() => {
            this.onClick("registration failed", "top", 500, false);
          }}
        >
          {(saveData, { loading, data }) => (
            <Formik
              onSubmit={(values, actions) => {
                console.log("values", values);
                {
                  saveData({
                    variables: {
                      branchInsuranceProvider: {
                        branch: { id: this.state.branchId },
                        insuranceProvider: {
                          id:
                            values.branchInsuranceProvider.insuranceProvider
                              .id[0]
                        },
                        isActive: true
                      }
                    }
                  });
                }
              }}
              enableReinitialize
              render={this._renderForm}
            />
          )}
        </Mutation>
        <Toast ref="toast" position={this.state.position} />

        <Toast
          ref="toastWithStyle"
          style={{ backgroundColor: "red" }}
          position={this.state.position}
        />
      </ScrollView>
    );
  }
}
const CREATE_BRANCH_INSURANCE_PROVIDER = gql`
  mutation createBranchInsuranceProvider(
    $branchInsuranceProvider: BranchInsuranceProviderInput
  ) {
    createBranchInsuranceProvider(
      branchInsuranceProvider: $branchInsuranceProvider
    ) {
      id
    }
  }
`;
export default withApollo(CreateBranchInsuranceProvider);
