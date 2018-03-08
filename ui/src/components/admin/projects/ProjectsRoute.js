import React from 'react';
import {Route} from 'react-router-dom';
import PropTypes from 'prop-types';

import Projects from './Projects';
import ProjectForm from './ProjectForm';

const ProjectsRoute = props => (
  <React.Fragment>
    <Route exact path={`${props.match.url}/`} component={Projects} />
    <Route path={`${props.match.url}/new`} component={ProjectForm} />
    <Route path={`${props.match.url}/:id/edit`} component={ProjectForm} />
  </React.Fragment>
);

ProjectsRoute.propTypes = {
  match: PropTypes.object
};

export default ProjectsRoute;
