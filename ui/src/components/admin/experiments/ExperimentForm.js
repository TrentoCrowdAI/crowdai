import React from 'react';
import {Container, Form, Button, Grid, Message} from 'semantic-ui-react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {actions} from './actions';

class ExperimentForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    const {item} = this.props;

    return (
      <Container>
        <Grid container centered>
          <Grid.Row>
            <Grid.Column width="4">
              <h1>New experiment</h1>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width="8">
              <Form
                error={this.props.error !== undefined}
                loading={this.props.loading}
                success={this.props.saved}
                onSubmit={() => this.props.submit()}>
                <Form.Input
                  label="Name"
                  name="name"
                  value={item.name}
                  placeholder="Experiment name"
                  onChange={this.handleChange}
                  required
                />
                <Form.Input
                  label="Number of Assignments"
                  name="assignments"
                  value={item.assigments}
                  placeholder="1"
                  onChange={this.handleChange}
                  type="number"
                  min="1"
                  required
                />

                {this.props.error && (
                  <Message
                    error
                    header="Error"
                    content={this.props.error.message || 'Changes not saved. Please try again.'}
                  />
                )}
                {this.props.saved && <Message success header="Success" content="Changes saved!" />}
                <Button floated="right" positive>
                  Save
                </Button>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }

  handleChange(e, {name, value}) {
    this.props.setInputValue(name, value);
  }
}

ExperimentForm.propTypes = {
  item: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.any,
  saved: PropTypes.bool,
  submit: PropTypes.func,
  setInputValue: PropTypes.func
};

const mapStateToProps = state => ({
  item: state.experiment.form.item,
  loading: state.experiment.form.loading,
  error: state.experiment.form.error,
  saved: state.experiment.form.saved
});

const mapDispatchToProps = dispatch => ({
  submit: () => dispatch(actions.submit()),
  setInputValue: (name, value) => dispatch(actions.setInputValue(name, value))
});

export default connect(mapStateToProps, mapDispatchToProps)(ExperimentForm);
