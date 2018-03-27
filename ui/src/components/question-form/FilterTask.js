import React from 'react';
import PropTypes from 'prop-types';
import {Segment, Header, Button, Grid, Message, Dimmer, Loader, Icon} from 'semantic-ui-react';
import {connect} from 'react-redux';

import {actions} from 'src/components/question-form/actions';

/**
 * Represents a filtering task.
 */
class FilterTask extends React.Component {
  /**
   * Returns a form for the task.
   * @return {React.Component}
   */
  render() {
    if (!this.props.task) {
      return (
        <Segment vertical>
          <Grid>
            <Grid.Row>
              <Dimmer active inverted>
                <Loader inverted>Loading</Loader>
              </Dimmer>
            </Grid.Row>
          </Grid>
        </Segment>
      );
    }

    if (this.initialTestFailed()) {
      return (
        <Message icon style={{marginTop: 20}}>
          <Icon name="frown" />
          <Message.Content>
            <Message.Header>Qualification test result</Message.Header>
            <p>Thank you for participating, but you failed to pass the qualification test.</p>
            <p>Please close this tab/window and go back to the HIT page on Amazon Mechanical Turk.</p>
          </Message.Content>
        </Message>
      );
    }

    if (this.finished()) {
      return (
        <Message icon style={{marginTop: 20}}>
          <Icon name="checkmark box" />
          <Message.Content>
            <Message.Header>Finished</Message.Header>
            <p>
              Thank you for completing the tasks. Please close this tab/window and go back to the HIT page on Amazon
              Mechanical Turk.
            </p>
          </Message.Content>
        </Message>
      );
    }

    let {task} = this.props;
    const style = {
      background: '#75de8e',
      color: 'white'
    };

    return (
      <Segment vertical>
        <Grid>
          <Grid.Row>
            <Grid.Column width={9}>
              <Header as="h3" style={{fontSize: '2em'}}>
                {task.data.item.title}
              </Header>
              <p style={{fontSize: '1em', textAlign: 'justify'}}>{task.data.item.description}</p>
            </Grid.Column>
            <Grid.Column width={6}>
              {task.data.criteria.map((criterion, idx) => (
                <div key={idx}>
                  <Header as="h3" style={{fontSize: '2em'}}>
                    {criterion.description}
                  </Header>

                  <Button.Group>
                    <Button
                      style={criterion.workerAnswer === 'yes' ? style : null}
                      type="button"
                      onClick={() => this.props.setAnswer(criterion, 'yes')}>
                      Yes
                    </Button>
                    <Button.Or />
                    <Button
                      style={criterion.workerAnswer === 'no' ? style : null}
                      type="button"
                      onClick={() => this.props.setAnswer(criterion, 'no')}>
                      No
                    </Button>
                    <Button.Or />
                    <Button
                      style={criterion.workerAnswer === 'not clear' ? style : null}
                      type="button"
                      onClick={() => this.props.setAnswer(criterion, 'not clear')}>
                      Not clear from the text
                    </Button>
                  </Button.Group>
                </div>
              ))}

              {this.props.answerSubmitError && (
                <Message negative>
                  <Message.Header>Error</Message.Header>
                  <p>Your answer could not be saved.</p>
                </Message>
              )}

              {this.props.answerSaved && (
                <React.Fragment>
                  {!this.props.task.data.initial && (
                    <FinishButton style={{marginTop: 40}} onClick={() => this.finish()} />
                  )}

                  <Button type="button" positive style={{marginTop: 40}} onClick={() => window.location.reload()}>
                    Next task
                  </Button>
                </React.Fragment>
              )}

              {!this.props.answerSaved && (
                <Button
                  type="submit"
                  loading={this.props.answerSubmitLoading}
                  positive
                  style={{marginTop: 40}}
                  disabled={!this.props.hasAcceptedHit}>
                  Submit
                </Button>
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }

  componentDidMount() {
    this.props.getNextTask();
  }

  finish() {
    this.props.finishAssignment();
  }

  initialTestFailed() {
    return (
      this.props.task.data.initialTestFailed ||
      (this.props.assignmentStatus && this.props.assignmentStatus.data.initialTestFailed)
    );
  }

  finished() {
    return this.props.task.data.finished || (this.props.assignmentStatus && this.props.assignmentStatus.data.finished);
  }
}

const FinishButton = props => {
  return (
    <Button type="button" color="blue" {...props}>
      Finish
    </Button>
  );
};

FilterTask.propTypes = {
  /** @ignore */
  task: PropTypes.object,

  /** @ignore */
  answer: PropTypes.object,

  /** @ignore */
  answerSaved: PropTypes.object,

  /** @ignore */
  answerSubmitError: PropTypes.object,

  /** @ignore */
  hasAcceptedHit: PropTypes.bool,

  /** @ignore */
  answerSubmitLoading: PropTypes.bool,

  /** @ignore */
  getNextTask: PropTypes.func,

  /** @ignore */
  setAnswer: PropTypes.func,

  /** @ignore */
  finishAssignment: PropTypes.func,

  /** @ignore */
  checkAssignmentStatus: PropTypes.func,

  assignmentStatus: PropTypes.object
};

const mapStateToProps = state => ({
  hasAcceptedHit: state.questionForm.hasAcceptedHit,
  task: state.questionForm.task,
  answer: state.questionForm.answer,
  answerSaved: state.questionForm.answerSaved,
  answerSubmitLoading: state.questionForm.answerSubmitLoading,
  answerSubmitError: state.questionForm.answerSubmitError,
  assignmentStatus: state.questionForm.assignmentStatus
});

const mapDispatchToProps = dispatch => ({
  getNextTask: _ => dispatch(actions.getNextTask()),
  setAnswer: (taskId, response) => dispatch(actions.setAnswer(taskId, response)),
  finishAssignment: () => dispatch(actions.finishAssignment()),
  checkAssignmentStatus: () => dispatch(actions.checkAssignmentStatus())
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterTask);
