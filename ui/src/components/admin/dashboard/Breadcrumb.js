import React from 'react';
import {Breadcrumb, Grid, Icon} from 'semantic-ui-react';
import {withBreadcrumbs} from 'react-router-breadcrumbs-hoc';
import {NavLink} from 'react-router-dom';
import PropTypes from 'prop-types';

class BreadcrumbWidget extends React.Component {
  render() {
    const {breadcrumbs} = this.props;

    return (
      <Grid style={{margin: '10px'}}>
        <Grid.Row style={{paddingBottom: 0, paddingTop: 0}}>
          <Grid.Column>
            <Breadcrumb size="large">
              {breadcrumbs.map(({breadcrumb, path, match}, idx) => (
                <React.Fragment key={path}>
                  <Breadcrumb.Section as={NavLink} to={match.url} exact>
                    {breadcrumb}
                  </Breadcrumb.Section>
                  {idx < breadcrumbs.length - 1 && <Breadcrumb.Divider icon="right angle" />}
                </React.Fragment>
              ))}
            </Breadcrumb>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

BreadcrumbWidget.propTypes = {
  breadcrumbs: PropTypes.arrayOf(PropTypes.object)
};

const routes = [
  {path: '/admin', breadcrumb: <Icon name="home" />},
  {path: '/admin/reports', breadcrumb: 'Reports'},
  {path: '/admin/reports/:projectid', breadcrumb: 'Charts'},
  {path: '/admin/projects', breadcrumb: 'Projects'},
  {path: '/admin/projects/new', breadcrumb: 'New'},
  {path: '/admin/projects/:projectId/screenings', breadcrumb: 'Jobs'},
  {path: '/admin/projects/:projectId/screenings/new', breadcrumb: 'New'},
  {path: '/admin/projects/:projectId/screenings/:experimentId/dashboard', breadcrumb: 'Dashboard'},
  {path: '/admin/profile', breadcrumb: 'Personal Information'}
];

export default withBreadcrumbs(routes)(BreadcrumbWidget);
