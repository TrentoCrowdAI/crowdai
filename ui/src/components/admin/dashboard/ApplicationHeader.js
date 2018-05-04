import React from 'react';
import {Menu, Icon, Image} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
// import {GoogleLogout} from 'react-google-login';

import config from 'src/config/config.json';

class ApplicationHeader extends React.Component {
  render() {
    const {pathname} = this.props.location;
    const {name, picture} = this.props.loginInfo;

    return (
      <Menu stackable style={{width: '100%'}}>
        <Menu.Item name="screenings" active={pathname === '/admin/screenings'}>
          <Link to="/admin/screenings" style={{color: 'rgba(0,0,0,.87)'}}>
            Jobs
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
              this.logoutSuccess();
              // TODO: google logout
            }}>
            <Icon name="sign out" />
            Logout
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }

  onMenuItemClick(e, {name}) {
    this.setState({activeItem: name});
  }

  logoutSuccess() {
    localStorage.removeItem(config.localStorageKey);
    window.location.reload();
  }
}

ApplicationHeader.propTypes = {
  loginInfo: PropTypes.object,
  location: PropTypes.object
};

const mapStateToProps = state => ({
  loginInfo: state.login.loginInfo
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationHeader);
