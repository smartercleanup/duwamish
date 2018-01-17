import React, { Component } from "react";
const cn = require("classnames");

import RadioField from "../form-fields/radio-field";
import "./big-radio-field.scss";

class BigRadioField extends Component {
  render() {
    const {
      autofillMode,
      checked,
      hasAutofill,
      id,
      label,
      name,
      onChange,
      required,
      value,
    } = this.props;
    const classNames = {
      label: cn("big-radio-field__label", "big-radio-field__label--hoverable", {
        "big-radio-field__label--toggled": checked,
        "big-radio-field__label--has-autofill--colored":
          hasAutofill && checked && autofillMode === "color",
      }),
    };

    return (
      <div className="big-radio-field">
        <RadioField
          className="big-radio-field__input"
          id={id}
          name={name}
          checked={checked}
          value={value}
          onChange={onChange}
          required={required}
        />
        <label className={classNames.label} htmlFor={id}>
          {label}
        </label>
      </div>
    );
  }
}

export default BigRadioField;
