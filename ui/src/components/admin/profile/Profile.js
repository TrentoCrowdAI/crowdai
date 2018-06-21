import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Container, Form, Button, Grid} from 'semantic-ui-react';

import {actions} from './actions';
import {UserModes} from 'src/utils/constants';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    const {profile} = this.props;

    return (
      <Container>
        <Grid container centered>
          <Grid.Row>
            <Grid.Column width="8" textAlign="center">
              <h1>My Profile</h1>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width="8">
              <Form error={this.props.error !== undefined} loading={this.props.loading} success={this.props.saved}>
                <Form.Input
                  label="Access Key ID"
                  name="data.accessKeyId"
                  value={profile.data.accessKeyId}
                  placeholder="Amazon Access Key"
                  onChange={this.handleChange}
                  required
                />

                <Form.Input
                  label="Secret Access Key"
                  name="data.secretAccessKey"
                  value={profile.data.secretAccessKey}
                  placeholder="Amazon Secret Access Key"
                  type="password"
                  onChange={this.handleChange}
                  required={!profile.updated_at}
                />

                <Form.Input label="Name" value={profile.data.name} readOnly />
                <Form.Input label="Email" value={profile.data.email} readOnly />

                <Form.Select
                  label="User mode"
                  name={'data.userMode'}
                  value={profile.data.userMode}
                  options={Object.entries(UserModes).map(([k, v]) => ({text: v, value: k}))}
                  onChange={this.handleChange}
                />
                <Button floated="right" positive onClick={() => this.doSubmit()}>
                  Save
                </Button>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }

  componentDidMount() {
    this.props.resetSaved();
  }

  handleChange(e, {name, value}) {
    this.props.setInputValue(name, value);
  }

  doSubmit() {
    this.props.submit();
  }
}

Profile.propTypes = {
  profile: PropTypes.object,
  loading: PropTypes.bool,
  fetchProfile: PropTypes.func,
  error: PropTypes.any,
  saved: PropTypes.bool,
  submit: PropTypes.func,
  setInputValue: PropTypes.func,
  resetSaved: PropTypes.func
};

const mapStateToProps = state => ({
  profile: state.profile.item,
  loading: state.profile.loading,
  error: state.profile.error,
  saved: state.profile.saved
});

const mapDispatchToProps = dispatch => ({
  submit: () => dispatch(actions.submit()),
  setInputValue: (name, value) => dispatch(actions.setInputValue(name, value)),
  resetSaved: () => dispatch(actions.resetSaved())
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
