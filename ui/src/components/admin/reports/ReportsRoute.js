import React from 'react';
import {Route} from 'react-router-dom';
import PropTypes from 'prop-types';

import ExperimentsRoute from 'src/components/admin/experiments/ExperimentsRoute';
import Reports from './Reports'
import ReportsForm from './ReportsForm'

const ReportsRoute = props => (
  <React.Fragment>
    <Route exact path={`${props.match.url}/`} component={ReportsForm} />
    <Route exact path={`${props.match.url}/:projectid`} component={Reports} />
  </React.Fragment>
);

ReportsRoute.propTypes = {
  match: PropTypes.object
};

export default ReportsRoute;
