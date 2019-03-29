import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import "moment-timezone";
import {
  dashboardPlacesSelector,
  placesPropType,
} from "../../state/ducks/places";
import {
  datasetConfigPropType,
  datasetConfigsSelector,
} from "../../state/ducks/datasets-config";
import {
  dashboardConfigSelector,
  dashboardConfigPropType,
} from "../../state/ducks/dashboard-config";
import {
  appConfigSelector,
  appConfigPropType,
} from "../../state/ducks/app-config";
import {
  placeFormsConfigSelector,
  placeFormsConfigPropType,
  formFieldsConfigSelector,
  formFieldsConfigPropType,
} from "../../state/ducks/forms-config";
import { hasAdminAbilities } from "../../state/ducks/user";
import { HorizontalRule } from "../atoms/layout";
import {
  Link,
  RegularTitle,
  LargeTitle,
  SmallTitle,
  LargeLabel,
  ExtraLargeLabel,
} from "../atoms/typography";
import PieChart from "../molecules/pie-chart";
import DemographicsBarChart from "../molecules/demographics-bar-chart";
import { connect } from "react-redux";
import styled from "@emotion/styled";

import groupBy from "lodash.groupby";
import {
  LineChart,
  Line,
  Label,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const MAX_DASHBOARD_WIDTH = "1120px";

// These are the colors we use for our charts:
const BLUE = "#5DA5DA";
const COLORS = [
  "#4D4D4D",
  "#B2912F",
  "#FAA43A",
  "#60BD68",
  "#F17CB0",
  BLUE,
  "#B276B2",
  "#DECF3F",
  "#F15854",
];

const DashboardWrapper = styled("div")({
  display: "grid",
  gridTemplateRows: "auto",
  gridTemplateColumns: "auto",
  maxWidth: MAX_DASHBOARD_WIDTH,
  margin: "8px auto 24px auto",
  overflow: "scroll",
  height: "100%",

  "&::-webkit-scrollbar": {
    display: "none",
  },
});

const DashboardTitle = styled(LargeTitle)({
  marginBottom: 0,
});

const DashboardHorizontalRule = styled(HorizontalRule)({
  marginTop: 0,
});

const OverviewWrapper = styled("div")({
  display: "grid",
  gridTemplateAreas: `
    'title'
    'link'
    'cardsWrapper'
  `,
  marginBottom: "24px",
});

const CardsWrapper = styled("div")({
  gridArea: "cardsWrapper",
  display: "grid",
  gridTemplateAreas: `
    'card1 card2 card3'
  `,
  justifyItems: "center",
});

const CardWrapper = styled("div")(props => ({
  boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
  margin: "8px",
  border: "2px solid grey",
  gridArea: props.gridArea,
  display: "grid",
  gridTemplateRows: "auto",
  gridTemplateColumns: "auto",
  padding: "16px",
  width: "160px",
}));

const CardNumber = styled(ExtraLargeLabel)(props => ({
  margin: "0 auto 0 auto",
  color: props.theme.brand.primary,
}));

const CardLabel = styled(LargeLabel)({
  margin: "0 auto 0 auto",
  textTransform: "uppercase",
});
const Card = cardProps => {
  return (
    <CardWrapper gridArea={cardProps.gridArea}>
      <CardNumber>{cardProps.number}</CardNumber>
      <CardLabel>{cardProps.label}</CardLabel>
    </CardWrapper>
  );
};

const DownloadDataLink = styled(Link)({
  textDecoration: "none",
  gridArea: "link",
  marginBottom: "16px",
});

const EngagementWrapper = styled("div")({
  display: "grid",
  gridTemplateRows: "max-content",
});

const SurveyWrapper = styled("div")({
  display: "grid",
  gridTemplateRows: "max-content",
  gridTemplateAreas: `
                    'title'
                    'wards'
                    'categories'
                    'demographics'
                `,
});
const ChartTitle = styled(SmallTitle)({
  margin: "0 auto 0 auto",
  textAlign: "center",
});
const WardsWrapper = styled("div")({
  gridArea: "wards",
});

const CategoriesWrapper = styled("div")({
  gridArea: "categories",
});

const DemographicsWrapper = styled("div")({
  gridArea: "demographics",
});

const getDaysArray = (start, end) => {
  let arr;
  let dt;
  for (arr = [], dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
    arr.push(new Date(dt));
  }
  return arr;
};

class Dashboard extends Component {
  state = {
    dashboard: this.props.dashboardConfig[0],
  };

  componentDidMount() {
    if (!this.props.hasAdminAbilities(this.state.dashboard.datasetSlug)) {
      this.props.router.navigate("/", { trigger: true });
    }
  }

  getLineChartData = () => {
    // `moment` has better time zone support, so we are using it here
    // instead of `Date`.
    let minDate = moment(8640000000000000); // Sep 13, 275760
    let maxDate = moment(0); // Jan 1, 1970
    const timeZone = this.props.appConfig.time_zone;
    const grouped = this.props.places
      ? groupBy(this.props.places, place => {
          const date = moment(place.created_datetime);
          if (minDate > date) {
            minDate = date;
          }
          if (maxDate < date) {
            maxDate = date;
          }
          return date.tz(timeZone).format("MM/DD/YYYY");
        })
      : {};

    // Get a list of all days in range, to account for days where no posts were made:
    const daysGrouped = getDaysArray(
      new Date(minDate),
      new Date(maxDate),
    ).reduce((memo, date) => {
      memo[
        `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
      ] = [];
      return memo;
    }, {});

    const lineChartData = Object.entries({ ...daysGrouped, ...grouped })
      .map(([day, places]) => ({
        date: new Date(day),
        day,
        count: places.length,
      }))
      .sort((a, b) => {
        return a.date - b.date;
      });

    return lineChartData;
  };

  render() {
    const commentsCount =
      this.props.places &&
      this.props.places.reduce((count, place) => {
        if (place.submission_sets.comments) {
          count += place.submission_sets.comments.length;
        }
        return count;
      }, 0);
    const supportsCount =
      this.props.places &&
      this.props.places.reduce((count, place) => {
        if (place.submission_sets.support) {
          count += place.submission_sets.support.length;
        }
        return count;
      }, 0);
    const dataset = this.props.datasetConfigs.find(
      config => config.slug === this.state.dashboard.datasetSlug,
    );

    return (
      <DashboardWrapper>
        <DashboardTitle>{"Analytics Dashboard"}</DashboardTitle>
        <DashboardHorizontalRule />
        <OverviewWrapper>
          <RegularTitle style={{ gridArea: "title" }}>Overview</RegularTitle>
          <DownloadDataLink
            href={`${this.props.apiRoot}${dataset.owner}/datasets/${
              dataset.slug
            }/mapseed-places.csv?format=csv&include_private_places&include_private_fields&page_size=10000`}
          >
            {`Download Submissions`}
          </DownloadDataLink>
          <CardsWrapper>
            <Card
              gridArea="card1"
              label={`${dataset.clientSlug}s`}
              number={this.props.places ? this.props.places.length : "..."}
            />
            <Card
              gridArea="card2"
              label="Comments"
              number={commentsCount ? commentsCount : "..."}
            />
            <Card
              gridArea="card3"
              label="Supports"
              number={supportsCount ? supportsCount : "..."}
            />
          </CardsWrapper>
        </OverviewWrapper>
        <EngagementWrapper>
          <RegularTitle>Engagement</RegularTitle>
          <LineChart
            width={1120}
            height={350}
            data={this.getLineChartData()}
            margin={{ top: 5, right: 30, left: 20, bottom: 24 }}
          >
            <XAxis dataKey="day">
              <Label value="Date" position="bottom" />
            </XAxis>
            <YAxis>
              <Label value={`Number of ${dataset.clientSlug}s`} angle={-90} />
            </YAxis>
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke={BLUE}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </EngagementWrapper>
        {this.state.dashboard.surveyMetrics && (
          <SurveyWrapper>
            <RegularTitle style={{ gridArea: "title" }}>Survey</RegularTitle>
            {/* TODO: Make these charts more data-driven. Right now, they are hard coded for durham */}
            {this.state.dashboard.surveyMetrics.wards && (
              <WardsWrapper>
                <ChartTitle>Wards</ChartTitle>

                {/* getLabelFromCategory is hacked until we can get
                the label from our form field display using a more
                sensible form datastructure */}
                <PieChart
                  places={this.props.places}
                  category="ward"
                  getLabelFromCategory={category => {
                    const firstLetter = category.charAt(0).toUpperCase();
                    return `${firstLetter}${category
                      .replace("_", " ")
                      .slice(1)}`;
                  }}
                  colors={COLORS}
                />
              </WardsWrapper>
            )}
            {this.state.dashboard.surveyMetrics.categories && (
              <CategoriesWrapper>
                <ChartTitle>Categories</ChartTitle>
                <PieChart
                  places={this.props.places}
                  category="location_type"
                  getLabelFromCategory={category =>
                    this.props.placeFormsConfig.find(
                      form => form.id === category,
                    ).label
                  }
                  colors={COLORS}
                />
              </CategoriesWrapper>
            )}
            {this.state.dashboard.surveyMetrics.demographics && (
              <DemographicsWrapper>
                <ChartTitle>Demographics</ChartTitle>
                <DemographicsBarChart
                  barFillColor={BLUE}
                  formFieldsConfig={this.props.formFieldsConfig}
                  places={this.props.places}
                />
              </DemographicsWrapper>
            )}
          </SurveyWrapper>
        )}
      </DashboardWrapper>
    );
  }
}

Dashboard.propTypes = {
  dashboardConfig: dashboardConfigPropType.isRequired,
  appConfig: appConfigPropType.isRequired,
  apiRoot: PropTypes.string,
  hasAdminAbilities: PropTypes.func.isRequired,
  router: PropTypes.instanceOf(Backbone.Router),
  places: placesPropType,
  placeFormsConfig: placeFormsConfigPropType.isRequired,
  formFieldsConfig: formFieldsConfigPropType,
  datasetConfigs: datasetConfigPropType,
};

const mapStateToProps = state => ({
  appConfig: appConfigSelector(state),
  hasAdminAbilities: datasetSlug => hasAdminAbilities(state, datasetSlug),
  places: dashboardPlacesSelector(state),
  dashboardConfig: dashboardConfigSelector(state),
  placeFormsConfig: placeFormsConfigSelector(state),
  formFieldsConfig: formFieldsConfigSelector(state),
  datasetConfigs: datasetConfigsSelector(state),
});

export default connect(mapStateToProps)(Dashboard);
