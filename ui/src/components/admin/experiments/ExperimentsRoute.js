import React from 'react';
import {Route} from 'react-router-dom';
import PropTypes from 'prop-types';

import Experiments from './Experiments';

const ExperimentsRoute = props => (
  <React.Fragment>
    <Route exact path={`${props.match.url}/`} component={Experiments} />
  </React.Fragment>
);

ExperimentsRoute.propTypes = {
  match: PropTypes.object
};

export default ExperimentsRoute;
