import React, { Component } from "react";
import TimePicker from "react-time-picker";

export default class MyApp extends Component {
  state = {
    time: ""
  };

  onChange = time => this.setState({ time });

  render() {
    return (
      <TimePicker
        amPmAriaLabel
        onChange={this.onChange}
        format="hh:mm"
        value={this.state.time}
      />
    );
  }
}
