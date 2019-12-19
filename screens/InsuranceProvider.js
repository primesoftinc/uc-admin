import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button, Input, Icon } from "react-native-elements";
import Header from "../util/Header";
import gql from "graphql-tag";
import { withApollo } from "react-apollo";
import Toast, { DURATION } from "react-native-easy-toast";
import _ from "lodash";
import { Formik } from "formik";
import { Alert } from "react-native-web";

class CreateBranch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: "top",
      insuranceProvider: {
        providerName: "",
        phoneNumber: ""
      }
    };
  }

  _createInsuranceProvider = async insuranceProvider => {
    console.log(insuranceProvider, "create");
    let res = await this.props.client.mutate({
      mutation: gql`
        mutation createInsuranceProvider(
          $insuranceProvider: InsuranceProviderInput
        ) {
          createInsuranceProvider(insuranceProvider: $insuranceProvider) {
            id
            phoneNumber
            providerName
          }
        }
      `,
      variables: {
        insuranceProvider: insuranceProvider
      }
    });
    const { createInsuranceProvider } = res.data;
    if (_.isEmpty(createInsuranceProvider.id)) {
      Alert.alert("Save failed");
    } else {
      Alert.alert("Save succesfull");
    }
  };

  onhandleSumbit = (values, errors) => {
    const insuranceProvider = {
      ...values
    };
    this._createInsuranceProvider(insuranceProvider);
  };

  renderForm = props => {
    console.log(props, "props");
    const { values } = props;
    const { providerName, phoneNumber } = values;
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
          Create InsuranceProvider
        </Text>

        <Input
          labelStyle={styles.labelStyle}
          containerStyle={styles.inputContainerStyle}
          label="Provider Name"
          autoCapitalize="none"
          value={providerName}
          onBlur={props.handleBlur("providerName")}
          onChangeText={props.handleChange("providerName")}
          onBlur={props.handleBlur("providerName")}
          name={"ProviderName"}
        />

        <Input
          labelStyle={styles.labelStyle}
          containerStyle={styles.inputContainerStyle}
          label="Phone number"
          autoCapitalize="none"
          name={"phoneNumber"}
          onChangeText={props.handleChange("phoneNumber")}
          value={phoneNumber}
          rightIcon={
            <Icon name="phone" type="font-awesome" size={24} color="grey" />
          }
          onBlur={props.handleBlur("phoneNumber")}
        />

        <Button
          containerStyle={{ width: 100 }}
          title="save"
          onPress={props.handleSubmit}
        />
        <Toast ref="toast" position={this.state.position} />
      </View>
    );
  };

  render() {
    return (
      <ScrollView>
        <Formik
          initialValues={{
            providerName: "",
            phoneNumber: ""
          }}
          onSubmit={(values, errors) => {
            this.onhandleSumbit(values, errors);
          }}
          render={this.renderForm}
        ></Formik>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  textInputContainerStyle: {
    borderBottomWidth: 1,
    borderBottomColor: "#4e38fe",
    padding: 10
  },
  labelStyle: {
    color: "grey",
    fontWeight: "normal"
  },
  inputContainerStyle: {
    paddingBottom: 10
  }
});

export default withApollo(CreateBranch);
