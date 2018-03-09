import React from 'react';
import {Route} from 'react-router-dom';
import PropTypes from 'prop-types';

import Projects from './Projects';
import ProjectForm from './ProjectForm';
import ExperimentsRoute from 'src/components/admin/experiments/ExperimentsRoute';

const ProjectsRoute = props => (
  <React.Fragment>
    <Route exact path={`${props.match.url}/`} component={Projects} />
    <Route path={`${props.match.url}/new`} component={ProjectForm} />
    <Route path={`${props.match.url}/:projectId/edit`} component={ProjectForm} />
    <Route path={`${props.match.url}/:projectId/screenings`} component={ExperimentsRoute} />
  </React.Fragment>
);

ProjectsRoute.propTypes = {
  match: PropTypes.object
};

export default ProjectsRoute;
