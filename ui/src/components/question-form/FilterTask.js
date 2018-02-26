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
    if (!this.props.task || this.props.assigmentStatusLoading) {
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

    if (!this.props.assigmentStatusLoading && this.props.task.initialTestFailed) {
      return (
        <Message icon style={{marginTop: 20}}>
          <Icon name="frown" />
          <Message.Content>
            <Message.Header>Qualification test result</Message.Header>
            <p>Thank you for participating, but you failed to pass the qualification test.</p>
            <p>Please click on the following button to finish.</p>
            <FinishButton onClick={() => this.finish()} />
          </Message.Content>
        </Message>
      );
    }

    if (this.props.assignmentStatus && this.props.assignmentStatus.finished) {
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

    if (!this.props.assigmentStatusLoading && this.props.task.maxTasks) {
      return (
        <Message icon style={{marginTop: 20}}>
          <Icon name="checkmark box" />
          <Message.Content>
            <Message.Header>Max tasks reached</Message.Header>
            <p>Thank you for completing the tasks. Click on the following button to finish.</p>
            <FinishButton onClick={() => this.finish()} />
          </Message.Content>
        </Message>
      );
    }

    let {task, answer} = this.props;

    if (task.type === 'testTask') {
      task = {
        id: task.id,
        item: {
          id: task.id,
          title: task.itemTitle,
          description: task.itemDescription
        },
        filter: {
          description: task.filterDescription
        },
        test: true
      };
    }

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
                {task.item.title}
              </Header>
              <p style={{fontSize: '1em', textAlign: 'justify'}}>{task.item.description}</p>
            </Grid.Column>
            <Grid.Column width={6}>
              <Header as="h3" style={{fontSize: '2em'}}>
                {task.filter.description}
              </Header>

              <Button.Group>
                <Button
                  style={answer && answer.response === 'yes' ? style : null}
                  type="button"
                  onClick={() => this.props.setAnswer(this.props.task, 'yes')}>
                  Yes
                </Button>
                <Button.Or />
                <Button
                  style={answer && answer.response === 'no' ? style : null}
                  type="button"
                  onClick={() => this.props.setAnswer(this.props.task, 'no')}>
                  No
                </Button>
                <Button.Or />
                <Button
                  style={answer && answer.response === 'not clear' ? style : null}
                  type="button"
                  onClick={() => this.props.setAnswer(this.props.task, 'not clear')}>
                  Not clear from the text
                </Button>
              </Button.Group>

              {this.props.answerSubmitError && (
                <Message negative>
                  <Message.Header>Error</Message.Header>
                  <p>Your answer could not be saved.</p>
                </Message>
              )}

              {this.props.answerSaved && (
                <React.Fragment>
                  <Button type="button" positive style={{marginTop: 40}} onClick={() => window.location.reload()}>
                    Next task?
                  </Button>

                  {!this.props.task.isInitialTest && (
                    <FinishButton style={{marginTop: 40}} onClick={() => this.finish()} />
                  )}
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
    this.props.checkAssignmentStatus();
    this.props.getNextTask();
  }

  finish() {
    this.props.finishAssignment();
  }
}

const FinishButton = props => {
  return (
    <Button type="button" positive {...props}>
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
  assignmentStatus: PropTypes.object,

  /** @ignore */
  finishAssignment: PropTypes.func,

  /** @ignore */
  checkAssignmentStatus: PropTypes.func,

  /** @ignore */
  assigmentStatusLoading: PropTypes.bool
};

const mapStateToProps = state => ({
  hasAcceptedHit: state.questionForm.hasAcceptedHit,
  task: state.questionForm.task,
  answer: state.questionForm.answer,
  answerSaved: state.questionForm.answerSaved,
  answerSubmitLoading: state.questionForm.answerSubmitLoading,
  answerSubmitError: state.questionForm.answerSubmitError,
  assignmentStatus: state.questionForm.assignmentStatus,
  assigmentStatusLoading: state.questionForm.assigmentStatusLoading
});

const mapDispatchToProps = dispatch => ({
  getNextTask: _ => dispatch(actions.getNextTask()),
  setAnswer: (taskId, response) => dispatch(actions.setAnswer(taskId, response)),
  finishAssignment: () => dispatch(actions.finishAssignment()),
  checkAssignmentStatus: () => dispatch(actions.checkAssignmentStatus())
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterTask);
