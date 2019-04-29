/** @jsx jsx */
import React from "react";
import PropTypes from "prop-types";
import { css, jsx } from "@emotion/core";
import { translate } from "react-i18next";

import { RegularText } from "../atoms/typography";

const errorMsgs = {
  missingGeometry:
    "Please use the drawing toolbar to add a point, line, or polygon to the map.",
  missingRequired: "Please fill out the field(s) outlined below.",
  mapNotDragged:
    "It looks like you haven't set a location for your post. Please drag and zoom the map to set a location.",
};

const WarningMessagesContainer = props => {
  return (
    <section
      css={css`
        background-color: #d9534f;
        padding: 8px;
        border: 2px dotted #fff;
        border-radius: 8px;
        color: #fff;
        margin-bottom: 32px;
      `}
    >
      <RegularText
        css={css`
          font-weight: 800;
          margin: 0 0 16px 0;
        `}
      >
        {props.headerMsg}
      </RegularText>
      <ul
        css={css`
          padding-left: 16px;
          margin-top: 16px;
          margin-bottom: 0;
        `}
      >
        {Array.from(props.errors).map((errorMsg, errorMsgIndex) => (
          <li
            key={errorMsg}
            css={css`
              list-style: none;
              margin-bottom: 8px;
            `}
          >
            <RegularText
              css={css`
                color: #fff;
                font-style: italic;

                &:before {
                  font-family: FontAwesome;
                  content: "\\f005"; /* solid star */
                  padding-right: 5px;
                  font-style: normal;
                }
              `}
            >
              {props.t(
                `invalidFormFieldMsg${errorMsgIndex}`,
                errorMsgs[errorMsg],
              )}
            </RegularText>
          </li>
        ))}
      </ul>
    </section>
  );
};

WarningMessagesContainer.propTypes = {
  errors: PropTypes.instanceOf(Set),
  headerMsg: PropTypes.string,
  t: PropTypes.func.isRequired,
};

export default translate("WarningMessagesContainer")(WarningMessagesContainer);
