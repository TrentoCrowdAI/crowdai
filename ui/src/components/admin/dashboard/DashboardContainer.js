import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Route, withRouter, Redirect} from 'react-router-dom';

import ApplicationHeader from 'src/components/admin/dashboard/ApplicationHeader';
import Dashboard from './Dashboard';

/**
 * Dashboard wrapper that checks user login status.
 */
class DashboardContainer extends React.Component {
  render() {
    return (
      <React.Fragment>
        {this.props.loggedIn && (
          <React.Fragment>
            <ApplicationHeader location={this.props.location} />
            <Route path="/admin" component={Dashboard} />
          </React.Fragment>
        )}
        {!this.props.loggedIn && <Redirect to="/login" />}
      </React.Fragment>
    );
  }
}

DashboardContainer.propTypes = {
  loggedIn: PropTypes.bool,
  location: PropTypes.object
};

const mapStateToProps = state => ({
  loginInfo: state.login.loginInfo,
  loggedIn: state.login.loggedIn
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DashboardContainer));
