import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
// import {GoogleLogout} from 'react-google-login';
import {Menu, Icon, Image} from 'semantic-ui-react';
import {Route, withRouter, Link, Switch, Redirect} from 'react-router-dom';

import Login from 'src/components/admin/login/Login';
import config from 'src/config/config.json';
import ExperimentsRoute from 'src/components/admin/experiments/ExperimentsRoute';
import Profile from 'src/components/admin/profile/Profile';
import {actions as profileActions} from 'src/components/admin/profile/actions';

class DashboardWidget extends React.Component {
  constructor(props) {
    super(props);
    this.logoutSuccess = this.logoutSuccess.bind(this);
    this.onMenuItemClick = this.onMenuItemClick.bind(this);
  }

  render() {
    const {name, picture} = this.props.loginInfo;
    const {pathname} = this.props.location;
    const {profile} = this.props;

    if (profile.id && !profile.requesterId && pathname !== '/admin/profile') {
      return <Redirect to="/admin/profile" />;
    }

    return (
      <React.Fragment>
        <Menu stackable style={{width: '100%'}}>
          <Menu.Item name="experiments" active={pathname === '/admin/experiments'}>
            <Link to="/admin/experiments" style={{color: 'rgba(0,0,0,.87)'}}>
              Experiments
            </Link>
          </Menu.Item>

          <Menu.Menu position="right">
            <Menu.Item name="profile" active={pathname === '/admin/profile'}>
              <Link to="/admin/profile" style={{color: 'rgba(0,0,0,.87)'}}>
                <Image circular src={picture} size="mini" spaced="right" />
                {name}
              </Link>
            </Menu.Item>
            <Menu.Item
              name="logout"
              active={pathname === 'logout'}
              onClick={(e, data) => {
                this.onMenuItemClick(e, data);
                // TODO: google logout
              }}>
              <Icon name="video camera" />
              Logout
            </Menu.Item>
          </Menu.Menu>
        </Menu>

        <div>
          <Switch>
            <Route path={'/admin/experiments'} component={ExperimentsRoute} />
            <Route path={'/admin/profile'} component={Profile} />
          </Switch>
        </div>
      </React.Fragment>
    );
  }

  onMenuItemClick(e, {name}) {
    this.setState({activeItem: name});
  }

  logoutSuccess() {
    localStorage.removeItem(config.localStorageKey);
    window.location.reload();
  }

  componentDidMount() {
    this.props.fetchProfile();
  }
}

DashboardWidget.propTypes = {
  loginInfo: PropTypes.object,
  fetchProfile: PropTypes.func,
  profile: PropTypes.object,
  /** @ignore */
  location: PropTypes.object
};

const dmapStateToProps = state => ({
  loginInfo: state.login.loginInfo,
  profile: state.profile.item
});

const dmapDispatchToProps = dispatch => ({
  fetchProfile: () => dispatch(profileActions.fetchItem())
});

const Dashboard = connect(dmapStateToProps, dmapDispatchToProps)(DashboardWidget);

/**
 * Dashboard wrapper to check user loggin status.
 */
class DashboardContainer extends React.Component {
  render() {
    return (
      <React.Fragment>
        {this.props.loggedIn && <Dashboard {...this.props} />}
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DashboardContainer));
