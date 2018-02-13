import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {GoogleLogout} from 'react-google-login';

import Login from 'src/components/admin/login/Login';
import config from 'src/config/config.json';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.logoutSuccess = this.logoutSuccess.bind(this);
  }

  render() {
    const {name, picture} = this.props.loginInfo;
    return (
      <React.Fragment>
        <h1>Welcome {name}!</h1>
        <img src={picture} />
        <GoogleLogout buttonText="Logout" onLogoutSuccess={this.onLogoutSuccess} />
      </React.Fragment>
    );
  }

  logoutSuccess() {
    localStorage.removeItem(config.localStorageKey);
    window.location.reload();
  }
}

Dashboard.propTypes = {
  loginInfo: PropTypes.object
};

class DashboardContainer extends React.Component {
  render() {
    return (
      <React.Fragment>
        {this.props.loggedIn && <Dashboard loginInfo={this.props.loginInfo} />}
        {!this.props.loggedIn && <Login />}
      </React.Fragment>
    );
  }
}

DashboardContainer.propTypes = {
  loggedIn: PropTypes.bool,
  loginInfo: PropTypes.object
};

const mapStateToProps = state => ({
  loginInfo: state.login.loginInfo,
  loggedIn: state.login.loggedIn
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
