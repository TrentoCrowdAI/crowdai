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
    if (this.props.error) {
      return (
        <Segment vertical>
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <Message style={{marginLeft: 'auto', marginRight: 'auto'}} negative>
                  <Message.Header>Error</Message.Header>
                  <p>
                    An error occurred while trying to fetch the task. Please refresh the page to retry. If the problem
                    persists, click on the following button to submit your progress. We will look into the problem and
                    contact you if needed.
                  </p>
                  <FinishButton
                    style={{marginTop: 40, marginRight: '0.6em'}}
                    onClick={() => {
                      this.finish(true);
                    }}
                  />
                </Message>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      );
    }

    if (this.props.loading || !this.props.task || this.props.assignmentStatusLoading) {
      return (
        <Segment vertical>
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <Dimmer active inverted>
                  <Loader inverted>Loading</Loader>
                </Dimmer>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      );
    }

    if (this.initialTestFailed()) {
      return (
        <Message icon style={{marginTop: 50}}>
          <Icon name="frown" />
          <Message.Content>
            <Message.Header>Qualification test result</Message.Header>
            <p>Thank you for participating, but you failed to pass the qualification test.</p>
            <p>Please close this tab/window and go back to the HIT page on Amazon Mechanical Turk.</p>
            <p>
              If you want to leave your anonymous feedback on the task, please click{' '}
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScUZPQ2d_awSlNAWsiOJ8uDF9CKeZsqrLnwKMbqC3dWOlF12Q/viewform?usp=sf_link"
                rel="noopener noreferrer"
                target="_blank">
                here.
              </a>
            </p>
          </Message.Content>
        </Message>
      );
    }

    if (this.finished()) {
      return <FinishMessage assignmentStatus={this.props.assignmentStatus} />;
    }

    let {task} = this.props;
    const style = {
      background: '#75de8e',
      color: 'white'
    };

    return (
      <Segment style={{marginTop: '2em', marginBottom: '2em'}} color="blue">
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
                  <p>
                    {this.props.answerSubmitError.message
                      ? this.props.answerSubmitError.message
                      : 'Your answer could not be saved.'}
                  </p>
                </Message>
              )}

              {!this.props.answerIsValid && (
                <Message header="Warning" content="Please provide an answer." warning visible />
              )}

              {this.props.answerSaved && <Message header="Success" content="Answer saved!" positive visible />}

              {this.props.task.workerSolvedMinTasks &&
                !this.props.answerSaved && (
                  <FinishButton style={{marginTop: 40, marginRight: '0.6em'}} onClick={() => this.finish()} />
                )}

              {!this.props.answerSaved && (
                <Button
                  type="submit"
                  loading={this.props.answerSubmitLoading}
                  positive
                  style={{marginTop: 40, width: '150px'}}
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

  finish(finishedWithError = false) {
    this.props.finishAssignment(finishedWithError);
  }

  initialTestFailed() {
    return this.props.assignmentStatus && this.props.assignmentStatus.data.initialTestFailed;
  }

  finished() {
    return this.props.assignmentStatus && this.props.assignmentStatus.data.end;
  }
}

const FinishButton = props => {
  return (
    <Button type="button" color="blue" {...props}>
      Finish
    </Button>
  );
};

const FinishMessage = props => {
  const {assignmentStatus} = props;

  return (
    <Message icon style={{marginTop: 50}}>
      <Icon name={assignmentStatus.data.honeypotFailed ? 'smile' : 'checkmark box'} />
      <Message.Content>
        <Message.Header>Finished</Message.Header>
        {(assignmentStatus.data.honeypotFailed || assignmentStatus.data.finishedByWorker) && (
          <p>
            Thank you for participating. Please close this tab/window and go back to the HIT page on Amazon Mechanical
            Turk.
          </p>
        )}
        {!assignmentStatus.data.honeypotFailed &&
          !assignmentStatus.data.finishedByWorker && (
            <p>
              Thank you for completing the tasks. Please close this tab/window and go back to the HIT page on Amazon
              Mechanical Turk.
            </p>
          )}
        <p>
          If you want to leave your anonymous feedback on the task, please click{' '}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScUZPQ2d_awSlNAWsiOJ8uDF9CKeZsqrLnwKMbqC3dWOlF12Q/viewform?usp=sf_link"
            rel="noopener noreferrer"
            target="_blank">
            here.
          </a>
        </p>
      </Message.Content>
    </Message>
  );
};

FinishMessage.propTypes = {
  assignmentStatus: PropTypes.object
};

FilterTask.propTypes = {
  task: PropTypes.object,
  answer: PropTypes.object,
  answerSaved: PropTypes.object,
  answerSubmitError: PropTypes.object,
  hasAcceptedHit: PropTypes.bool,
  answerSubmitLoading: PropTypes.bool,
  getNextTask: PropTypes.func,
  setAnswer: PropTypes.func,
  finishAssignment: PropTypes.func,
  checkAssignmentStatus: PropTypes.func,
  assignmentStatus: PropTypes.object,
  error: PropTypes.object,
  loading: PropTypes.bool,
  answerIsValid: PropTypes.bool,
  assignmentStatusLoading: PropTypes.bool
};

const mapStateToProps = state => ({
  hasAcceptedHit: state.questionForm.hasAcceptedHit,
  task: state.questionForm.task,
  error: state.questionForm.error,
  loading: state.questionForm.loading,
  answer: state.questionForm.answer,
  answerSaved: state.questionForm.answerSaved,
  answerSubmitLoading: state.questionForm.answerSubmitLoading,
  answerSubmitError: state.questionForm.answerSubmitError,
  assignmentStatus: state.questionForm.assignmentStatus,
  assignmentStatusLoading: state.questionForm.assignmentStatusLoading,
  answerIsValid: state.questionForm.answerIsValid
});

const mapDispatchToProps = dispatch => ({
  getNextTask: _ => dispatch(actions.getNextTask()),
  setAnswer: (taskId, response) => dispatch(actions.setAnswer(taskId, response)),
  finishAssignment: finishedWithError => dispatch(actions.finishAssignment(finishedWithError)),
  checkAssignmentStatus: () => dispatch(actions.checkAssignmentStatus())
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterTask);
