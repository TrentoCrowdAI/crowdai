import React from 'react';
import {Route} from 'react-router-dom';
import PropTypes from 'prop-types';

import Jobs from './Jobs';
import JobForm from './JobForm';
import JobDashboard from './JobDashboard';

const JobsRoute = props => (
  <React.Fragment>
    <Route exact path={`${props.match.path}`} component={Jobs} />
    <Route path={`${props.match.path}/new`} component={JobForm} />
    <Route path={`${props.match.path}/:jobId/edit`} component={JobForm} />
    <Route path={`${props.match.path}/:jobId/dashboard`} component={JobDashboard} />
  </React.Fragment>
);

JobsRoute.propTypes = {
  match: PropTypes.object
};

export default JobsRoute;
