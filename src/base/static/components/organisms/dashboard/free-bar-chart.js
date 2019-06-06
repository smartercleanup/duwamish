import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Label,
  Tooltip,
} from "recharts";

import ChartWrapper from "./chart-wrapper";
import {
  getFormatter,
  getNumericalPart,
  BLUE,
} from "../../../utils/dashboard-utils";

const NULL_RESPONSE_NAME = "__no-response__";

const getFreeBarChartData = ({ dataset, widget }) => {
  const labels = {
    ...widget.labels,
    [NULL_RESPONSE_NAME]: "No response",
  };

  const totalPlaces = dataset ? dataset.length : 100;
  const grouped = dataset
    ? dataset.reduce((memo, place) => {
        // Create a memo dict of the response categories, mapped to a count of
        // Places that fit in each category.
        // ie: { 'white': 2, 'black': 7 }
        const response = place[widget.groupBy]
          ? place[widget.groupBy]
          : NULL_RESPONSE_NAME;
        const responseArray = Array.isArray(response) ? response : [response];

        responseArray.forEach(category => {
          if (memo[category]) {
            memo[category].count++;
            memo[category].sum += getNumericalPart(response);
          } else {
            memo[category] = {
              count: 1,
              sum: getNumericalPart(response),
            };
          }
        });

        return memo;
      }, {})
    : [];

  const barChartData = Object.entries(grouped).map(
    ([category, categoryInfo]) => {
      return {
        ...categoryInfo,
        label: labels[category],
        category,
        percent: `${((categoryInfo.count / totalPlaces) * 100).toFixed(0)}%`,
      };
    },
  );

  return barChartData;
};

const getTooltipFormatter = (format, groupAggregation) => {
  if (format === "plain" && groupAggregation === "count") {
    return getFormatter("tooltip-count");
  } else if (format === "plain" && groupAggregation === "sum") {
    return getFormatter("tooltip-sum");
  } else if (format === "currency" && groupAggregation === "count") {
    // TOOD-- probably not needed
  } else if (format === "currency" && groupAggregation === "sum") {
    return getFormatter("tooltip-currency");
  } else {
    return getFormatter("tooltip-count");
  }
};

class FreeBarChart extends Component {
  render() {
    return (
      <ChartWrapper layout={this.props.layout} header={this.props.header}>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart
            data={this.props.data}
            margin={{ top: 5, right: 30, left: 36, bottom: 160 }}
          >
            <XAxis
              tickFormatter={getFormatter("truncated")(12)}
              dataKey={"label"}
              angle={-45}
              stroke="#aaa"
              textAnchor="end"
              interval={0}
            >
              <Label
                content={() => (
                  <g>
                    <text x="50%" y={286} fill="#aaa" textAnchor="middle">
                      {this.props.xAxisLabel}
                    </text>
                    {this.props.annotation && (
                      <text
                        fill="#aaa"
                        x="50%"
                        y={320}
                        fontSize=".7em"
                        textAnchor="middle"
                      >
                        {this.props.annotation}
                      </text>
                    )}
                  </g>
                )}
                offset={96}
                position="bottom"
              />
            </XAxis>
            <YAxis
              stroke="#aaa"
              tickFormatter={getFormatter(this.props.format)}
            >
              {this.props.yAxisLabel && (
                <Label
                  offset={10}
                  fill="#aaa"
                  value={this.props.yAxisLabel}
                  angle={-90}
                  position="left"
                />
              )}
            </YAxis>
            <Tooltip
              cursor={false}
              formatter={getTooltipFormatter(
                this.props.format,
                this.props.groupAggregation,
              )}
              labelFormatter={label => label}
            />
            <Bar dataKey={this.props.groupAggregation} fill={BLUE} />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    );
  }
}

FreeBarChart.propTypes = {
  annotation: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
      sum: PropTypes.number.isRequired,
      label: PropTypes.string,
      percent: PropTypes.string.isRequire,
    }),
  ).isRequired,
  format: PropTypes.string,
  groupAggregation: PropTypes.string.isRequired,
  header: PropTypes.string,
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string,
  category: PropTypes.string.isRequired,
  layout: PropTypes.shape({
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
  }).isRequired,
};

export { FreeBarChart, getFreeBarChartData };
