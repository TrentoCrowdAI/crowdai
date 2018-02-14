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
            <Grid.Column width="10">
              <Form
                error={this.props.error !== undefined}
                loading={this.props.loading}
                success={this.props.saved}
                onSubmit={() => this.props.submit()}>
                <Form.Group>
                  <Form.Input
                    width={12}
                    label="Name"
                    name="name"
                    value={item.name}
                    placeholder="Experiment name"
                    onChange={this.handleChange}
                    required
                  />
                  <Form.Input
                    width={4}
                    label="Assignments"
                    name="assignments"
                    value={item.assignments}
                    placeholder="1"
                    onChange={this.handleChange}
                    type="number"
                    min="1"
                    required
                  />
                </Form.Group>

                <Form.Group widths="equal">
                  <Form.Input
                    label="Items URL"
                    name="itemsUrl"
                    value={item.itemsUrl}
                    placeholder="URL to items CSV file"
                    onChange={this.handleChange}
                    required
                  />

                  <Form.Input
                    label="Filters URL"
                    name="filtersUrl"
                    value={item.filtersUrl}
                    placeholder="URL to filters CSV file"
                    onChange={this.handleChange}
                    required
                  />

                  <Form.Input
                    label="Tests URL"
                    name="testsUrl"
                    value={item.testsUrl}
                    placeholder="URL to tests CSV file"
                    onChange={this.handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group widths="equal">
                  <Form.Input
                    label="Max. tasks"
                    name="maxTasksRule"
                    value={item.maxTasksRule}
                    onChange={this.handleChange}
                    type="number"
                    min="1"
                    required
                  />

                  <Form.Input
                    label="Task reward"
                    name="taskRewardRule"
                    value={item.taskRewardRule}
                    onChange={this.handleChange}
                    type="number"
                    required
                  />

                  <Form.Input
                    label="Test frequency"
                    name="testFrequencyRule"
                    value={item.testFrequencyRule}
                    onChange={this.handleChange}
                    type="number"
                    min="1"
                    required
                  />
                </Form.Group>

                <Form.Group widths="equal">
                  <Form.Input
                    label="Initial tests"
                    name="initialTestsRule"
                    value={item.initialTestsRule}
                    onChange={this.handleChange}
                    type="number"
                    min="1"
                    required
                  />

                  <Form.Input
                    label="Initial Tests min score (%)"
                    name="initialTestsMinCorrectAnswersRule"
                    value={item.initialTestsMinCorrectAnswersRule}
                    onChange={this.handleChange}
                    type="number"
                    min="1"
                    max="100"
                    required
                  />

                  <Form.Input
                    label="Answers per task"
                    name="votesPerTaskRule"
                    value={item.votesPerTaskRule}
                    onChange={this.handleChange}
                    type="number"
                    min="1"
                    required
                  />
                </Form.Group>

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

  componentDidMount() {
    this.props.cleanState();
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
  setInputValue: PropTypes.func,
  cleanState: PropTypes.func
};

const mapStateToProps = state => ({
  item: state.experiment.form.item,
  loading: state.experiment.form.loading,
  error: state.experiment.form.error,
  saved: state.experiment.form.saved
});

const mapDispatchToProps = dispatch => ({
  submit: () => dispatch(actions.submit()),
  cleanState: () => dispatch(actions.cleanState()),
  setInputValue: (name, value) => dispatch(actions.setInputValue(name, value))
});

export default connect(mapStateToProps, mapDispatchToProps)(ExperimentForm);
