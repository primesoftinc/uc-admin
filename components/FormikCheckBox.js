import { CheckBox } from "react-native-elements";
import React from "react";
export const FormikCheckBox = ({
  field, // { name, value, onChange, onBlur }
  form,
  checked,
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => (
  <CheckBox
    containerStyle={{
      width: 400,
      padding: 10,
      alignItems: "center"
    }}
    {...field}
    {...props}
    form={form}
    center
    title={props.title}
    checked={_.get(form.values, field.name, false)}
    // checked={checked}
    onPress={() => {
      form.setFieldValue(field.name, !_.get(form.values, field.name, false));
    }}
  />
);
