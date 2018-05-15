import React from "react";
import PropTypes from "prop-types";

import ResponseField from "../form-fields/response-field";
import fieldResponseFilter from "../../utils/field-response-filter";

const StandardFieldSummary = props => {
  return (
    <div className="standard-field-summary">
      {fieldResponseFilter(
        props.fields,
        props.placeModel,
      ).map(fieldConfig => (
        <ResponseField
          key={fieldConfig.name}
          fieldConfig={fieldConfig}
          fieldValue={props.placeModel.get(fieldConfig.name)}
          attachmentModels={props.attachmentModels}
        />
      ))}
    </div>
  );
};

StandardFieldSummary.propTypes = {
  fields: PropTypes.array.isRequired,
  placeModel: PropTypes.object.isRequired,
  attachmentModels: PropTypes.object.isRequired,
}

export default StandardFieldSummary;
