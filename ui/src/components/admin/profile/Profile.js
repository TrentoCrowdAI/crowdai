import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Container, Form, Button, Grid, Message} from 'semantic-ui-react';

import {actions} from './actions';

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
            <Grid.Column width="4">
              <h1>My Profile</h1>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width="4">
              <Form error={this.props.error !== undefined} loading={this.props.loading} success={this.props.saved}>
                <Form.Input
                  label="Requester ID"
                  name="requesterId"
                  value={profile.requesterId}
                  placeholder="Mechanical Turk Requester ID..."
                  onChange={this.handleChange}
                  required
                />
                <Form.Input label="Email" value={profile.email} readOnly />
                <Form.Input label="Name" value={profile.name} readOnly />

                {this.props.error && (
                  <Message
                    error
                    header="Error"
                    content={this.props.error.message || 'Changes not saved. Please try again.'}
                  />
                )}
                {this.props.saved && <Message success header="Success" content="Profile saved!" />}
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
    this.props.fetchProfile();
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
  setInputValue: PropTypes.func
};

const mapStateToProps = state => ({
  profile: state.profile.profile,
  loading: state.profile.loading,
  error: state.profile.error,
  saved: state.profile.saved
});

const mapDispatchToProps = dispatch => ({
  fetchProfile: () => dispatch(actions.fetchProfile()),
  submit: () => dispatch(actions.submit()),
  setInputValue: (name, value) => dispatch(actions.setInputValue(name, value))
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
