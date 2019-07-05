/** @jsx jsx */
import * as React from "react";
import { jsx, css, ClassNames } from "@emotion/core";
import PropTypes from "prop-types";

import makeParsedExpression from "../../../utils/expression/parse";
import ChartWrapper from "./chart-wrapper";
import BaseTable from "./base-table";

const fixedTablePropTypes = {
  data: PropTypes.shape({
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        dataKey: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
      }),
    ).isRequired,
    rows: PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
            .isRequired,
          label: PropTypes.string,
          type: PropTypes.string.isRequired,
        }).isRequired,
      ).isRequired,
    ).isRequired,
    headers: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  }).isRequired,
  header: PropTypes.string.isRequired,
  layout: PropTypes.shape({
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
    height: PropTypes.string,
  }).isRequired,
};

type Props = PropTypes.InferProps<typeof fixedTablePropTypes>;

const getFixedTableData = ({ places, widget }) => {
  const columnFilters = widget.columns.map(column => {
    if (column.filter) {
      return makeParsedExpression(column.filter);
    }
  });

  const fixedTableRows = widget.rows.map(row => {
    return row.cells.reduce((cells, cell, i) => {
      const dataset = places.filter(place => {
        if (!columnFilters[i]) {
          return true;
        } else {
          return columnFilters[i].evaluate({ place });
        }
      });

      const parsedExpression = makeParsedExpression(cell.value);

      return {
        ...cells,
        [widget.columns[i].header]: {
          type: widget.columns[i].type,
          label: cell.label,
          value: parsedExpression
            ? [].concat(parsedExpression.evaluate({ dataset }))
            : [],
        },
      };
    }, {});
  });

  const fixedTableColumns = widget.columns.map(column => ({
    label: column.header,
    dataKey: column.header,
    type: column.type,
    fractionalWidth: column.fractionalWidth || 1,
  }));

  return {
    columns: fixedTableColumns,
    rows: fixedTableRows,
  };
};

class FixedTable extends React.Component<Props> {
  render() {
    return (
      <ChartWrapper layout={this.props.layout} header={this.props.header}>
        <BaseTable
          columns={this.props.data.columns}
          rows={this.props.data.rows}
          stripeColor={this.props.stripeColor}
        />
      </ChartWrapper>
    );
  }
}

export { FixedTable, getFixedTableData };