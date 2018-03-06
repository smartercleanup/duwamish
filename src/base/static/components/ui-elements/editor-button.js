import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import "./editor-button.scss";

const EditorButton = props => {
  return (
    <button
      className={classNames("editor-button", props.className, {
        "editor-button--toggle": props.type === "toggle",
        "editor-button--toggle--depressed":
          props.type === "toggle" && props.isEditModeToggled,
        "editor-button--save": props.type === "save",
        "editor-button--save--faded":
          props.type === "save" && !props.isModified,
        "editor-button--remove": props.type === "remove",
      })}
      disabled={
        props.isFormSubmitting || (props.type === "save" && !props.isModified)
      }
      onClick={props.onClick}
    >
      <span
        className={classNames("editor-button__icon", props.className, {
          "editor-button__icon--toggle": props.type === "toggle",
          "editor-button__icon--save": props.type === "save",
          "editor-button__icon--remove": props.type === "remove",
        })}
      />
      {props.label}
    </button>
  );
};

EditorButton.propTypes = {
  className: PropTypes.string,
  isEditModeToggled: PropTypes.bool,
  isFormSubmitting: PropTypes.bool.isRequired,
  isModified: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default EditorButton;
