import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import { connect } from "react-redux";

import { SiteLogo } from "../atoms/imagery";
import { Button } from "../atoms/buttons";
import { Link } from "../atoms/navigation";

import { pagesConfigSelector } from "../../state/ducks/pages-config";
import { appConfigSelector } from "../../state/ducks/app-config";

// TODO: Make the outermost div a header element when we dissolve base.hbs.
// Right now the header element lives in base.hbs.
const SiteHeaderWrapper = styled("div")(props => ({
  backgroundColor: props.theme.bg.default,
  display: "flex",
  alignItems: "center",
  height: "100%",
}));

const PagesNavContainer = styled("nav")(props => ({
  marginLeft: "50px",
}));

const PageNavButton = styled(props => {
  return (
    <Button className={props.className} color="tertiary">
      {props.children}
    </Button>
  );
})(() => ({
  marginLeft: "4px",
  marginRight: "4px",
}));

const SiteHeader = props => {
  return (
    <SiteHeaderWrapper>
      <SiteLogo src={props.appConfig.logo} alt={props.appConfig.name} />
      <PagesNavContainer>
        {props.pagesConfig.filter(page => !page.hide_from_top_bar).map(page => (
          <a key={page.slug} href={`/page/${page.slug}`} rel="internal">
            <PageNavButton>{page.title}</PageNavButton>
          </a>
        ))}
      </PagesNavContainer>
      {props.appConfig.list_enabled !== false && (
        <div>I'm a list toggle button</div>
      )}
    </SiteHeaderWrapper>
  );
};

SiteHeader.propTypes = {};

const mapStateToProps = state => ({
  appConfig: appConfigSelector(state),
  pagesConfig: pagesConfigSelector(state),
});

export default connect(mapStateToProps)(SiteHeader);
