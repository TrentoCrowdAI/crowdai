import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Route, Switch, Redirect} from 'react-router-dom';

import Profile from 'src/components/admin/profile/Profile';
import {actions as profileActions} from 'src/components/admin/profile/actions';
import ProjectsRoute from 'src/components/admin/projects/ProjectsRoute';

/**
 * Dashboard main
 */
class Dashboard extends React.Component {
  render() {
    const {profile} = this.props;
    const {pathname} = this.props.location;

    if (profile.id && !profile.data.accessKeyId && pathname !== '/admin/profile') {
      return <Redirect to="/admin/profile" />;
    }

    return (
      <Switch>
        <Route path={'/admin/projects'} component={ProjectsRoute} />
        <Route path={'/admin/profile'} component={Profile} />
        <Route render={() => <Redirect to="/admin/projects" />} />
      </Switch>
    );
  }

  componentDidMount() {
    this.props.fetchProfile();
  }
}

Dashboard.propTypes = {
  fetchProfile: PropTypes.func,
  profile: PropTypes.object,
  /** @ignore */
  location: PropTypes.object
};

const mapStateToProps = state => ({
  profile: state.profile.item
});

const mapDispatchToProps = dispatch => ({
  fetchProfile: () => dispatch(profileActions.fetchItem())
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
