import MultipleSelect from "./MultipleSelect";
import React from "react";

export const FormikMultiSelect = ({
  field, // { name, value, onChange, onBlur }
  form,
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => (
  //<View>
  <MultipleSelect
    {...field}
    {...props}
    field={field}
    form={form}
    data={props.data}
    single={props.single}
    uniqueKey={props.uniqueKey}
    displayKey={props.displayKey}
    selectedItems={
      props.selectedItems
      //form.values.branchUser.user.userRoles
      // ? form.values.branchUser.user.userRoles
      //: []
    }
    // onSelectedItemsChange = {}
    // updateSelectedData={props.updateSelectedRoles}
  />
  //</View>
);
