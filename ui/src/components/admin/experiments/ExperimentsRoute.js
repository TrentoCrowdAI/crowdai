import React from 'react';
import {Route} from 'react-router-dom';
import PropTypes from 'prop-types';

import Experiments from './Experiments';
import ExperimentForm from './ExperimentForm';
import ExperimentPublishPage from './ExperimentPublishPage';

const ExperimentsRoute = props => (
  <React.Fragment>
    <Route exact path={`${props.match.url}/`} component={Experiments} />
    <Route path={`${props.match.url}/new`} component={ExperimentForm} />
    <Route path={`${props.match.url}/:experimentId/publish`} component={ExperimentPublishPage} />
  </React.Fragment>
);

ExperimentsRoute.propTypes = {
  match: PropTypes.object
};

export default ExperimentsRoute;
