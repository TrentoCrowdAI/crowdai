import React from 'react';
import {GoogleLogin} from 'react-google-login';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router';
import {Form, Grid, Header, Segment} from 'semantic-ui-react';

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
      <div className="login-form">
        <style>{`
          body > div,
          body > div > div,
          body > div > div > div.login-form {
            height: 100%;
          }
        `}</style>
        <Grid textAlign="center" style={{height: '100%'}} verticalAlign="middle">
          <Grid.Column style={{maxWidth: 450}}>
            <Header as="h2" color="blue" textAlign="center">
              CrowdRev
            </Header>
            <Form size="large">
              <Segment stacked>
                <div style={{marginBottom: '20px'}}>Please sign in using your google account.</div>
                <GoogleLogin
                  className="ui google button"
                  style={{background: '#4285f4', color: '#fff'}}
                  clientId={config.google.clientId}
                  buttonText="Sign in with Google"
                  onSuccess={this.onSuccess}
                  onFailure={this.onFailure}
                />
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
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
