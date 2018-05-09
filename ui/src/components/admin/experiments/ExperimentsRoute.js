import React from 'react';
import {Route} from 'react-router-dom';
import PropTypes from 'prop-types';

import Experiments from './Experiments';
import ExperimentForm from './ExperimentForm';
import ExperimentDashboard from './ExperimentDashboard';

const ExperimentsRoute = props => (
  <React.Fragment>
    <Route exact path={`${props.match.path}`} component={Experiments} />
    <Route path={`${props.match.path}/new`} component={ExperimentForm} />
    <Route path={`${props.match.path}/:jobId/edit`} component={ExperimentForm} />
    <Route path={`${props.match.path}/:jobId/dashboard`} component={ExperimentDashboard} />
  </React.Fragment>
);

ExperimentsRoute.propTypes = {
  match: PropTypes.object
};

export default ExperimentsRoute;
