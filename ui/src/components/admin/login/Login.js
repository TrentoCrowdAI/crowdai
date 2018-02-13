import React from 'react';
import {GoogleLogin} from 'react-google-login';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router';

import config from 'src/config/config.json';
import {actions} from './actions';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.onSuccess = this.onSuccess.bind(this);
    this.onFailure = this.onFailure.bind(this);
  }

  render() {
    if (this.props.loggedIn) {
      return <Redirect to="/admin" />;
    } else if (this.props.loading) {
      return <p>Loading...</p>;
    }
    return (
      <GoogleLogin
        clientId={config.google.clientId}
        buttonText="Login"
        onSuccess={this.onSuccess}
        onFailure={this.onFailure}
      />
    );
  }

  onSuccess(response) {
    this.props.verifyGoogleToken(response.tokenId);
  }

  onFailure(error) {
    console.error(error);
  }

  componentDidMount() {
    this.props.verifyGoogleToken();
  }
}

Login.propTypes = {
  verifyGoogleToken: PropTypes.func,
  loggedIn: PropTypes.bool,
  loading: PropTypes.bool
};

const mapStateToProps = state => ({
  loggedIn: state.login.loggedIn,
  loading: state.login.loading
});

const mapDispatchToProps = dispatch => ({
  verifyGoogleToken: token => dispatch(actions.verifyGoogleToken(token))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
