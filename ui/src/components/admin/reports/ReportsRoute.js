import React from 'react';
import {Route} from 'react-router-dom';
import PropTypes from 'prop-types';

import Reports from './Reports'
import ReportsForm from './ReportsForm'

const ReportsRoute = props => (
  <React.Fragment>
    <Route exact path={`${props.match.url}/`} component={ReportsForm} />
    <Route exact path={`${props.match.url}/:jobid`} component={Reports} />
  </React.Fragment>
);

ReportsRoute.propTypes = {
  match: PropTypes.object
};

export default ReportsRoute;
