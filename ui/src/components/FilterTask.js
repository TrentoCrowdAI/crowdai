import React from 'react';
import PropTypes from 'prop-types';
import {Segment, Header, Button, Grid} from 'semantic-ui-react';
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
      return <div>Loading....</div>;
    }
    const {task, answer} = this.props;

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
                Description of the paper #{task.item.id}
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
                  onClick={() => this.props.setAnswer(task.id, 'yes')}>
                  Yes
                </Button>
                <Button.Or />
                <Button
                  style={answer && answer.response === 'no' ? style : null}
                  type="button"
                  onClick={() => this.props.setAnswer(task.id, 'no')}>
                  No
                </Button>
                <Button.Or />
                <Button
                  style={answer && answer.response === 'not clear' ? style : null}
                  type="button"
                  onClick={() => this.props.setAnswer(task.id, 'not clear')}>
                  Not clear from the text
                </Button>
              </Button.Group>

              <Button type="submit" positive style={{marginTop: 40}} disabled={!this.props.hasAcceptedHit}>
                Submit
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }

  componentWillMount() {
    this.props.getNextTask();
  }
}

FilterTask.propTypes = {
  task: PropTypes.object,
  answer: PropTypes.object,

  /** @ignore */
  hasAcceptedHit: PropTypes.bool,

  /** @ignore */
  getNextTask: PropTypes.func,

  /** @ignore */
  setAnswer: PropTypes.func
};

const mapStateToProps = state => ({
  hasAcceptedHit: state.questionForm.hasAcceptedHit,
  task: state.questionForm.task,
  answer: state.questionForm.answer
});

const mapDispatchToProps = dispatch => ({
  getNextTask: _ => dispatch(actions.getNextTask()),
  setAnswer: (taskId, response) => dispatch(actions.setAnswer(taskId, response))
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterTask);
