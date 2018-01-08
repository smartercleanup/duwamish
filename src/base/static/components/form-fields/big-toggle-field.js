import React, { Component } from "react";
const cn = require("classnames");

import ToggleField from "../form-fields/toggle-field";
import "./big-toggle-field.scss";

class BigToggleField extends Component {

  render() {
    const { autofillMode, hasAutofill, id, checked, labels, name, onChange,
            required, values } = this.props;
    const classNames = {
      base: cn("big-toggle-field", {
        "big-toggle-field--has-autofill--hidden": hasAutofill && autofillMode === "hide"
      }),
      label: cn("big-toggle-field__label", "big-toggle-field__label--hoverable", {
        "big-toggle-field__label--toggled": checked,
        "big-toggle-field__label--has-autofill--colored": hasAutofill && autofillMode === "color"
      })
    };

    return (
      <div className={classNames.base}>
        <ToggleField
          className="big-toggle-field__input"
          id={id}
          name={name}
          checked={checked}
          value={(checked) ? values[0] : values[1]}
          onChange={onChange}
          required={required} />
        <label
          className={classNames.label}
          htmlFor={id}>
          {(checked) ? labels[0] : labels[1]}
        </label>
      </div>
    );
  }
};

export default BigToggleField;
