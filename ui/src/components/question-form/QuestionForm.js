import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Form} from 'semantic-ui-react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {actions} from 'src/components/question-form/actions';

/**
 * Encapsulates validation logic.
 */
class QuestionForm extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  render() {
    return <Form onSubmit={this.submit}>{this.props.hasAcceptedHit && this.props.children}</Form>;
  }

  submit(event) {
    event.preventDefault();

    let payload = {
      task: this.props.task,
      workerTurkId: this.props.session.workerId
    };
    this.props.submitAnswer(payload);
  }
}

QuestionForm.propTypes = {
  children: PropTypes.element,
  hasAcceptedHit: PropTypes.bool,
  submitAnswer: PropTypes.func,
  task: PropTypes.object,
  session: PropTypes.object
};

const mapStateToProps = state => ({
  hasAcceptedHit: state.questionForm.hasAcceptedHit,
  task: state.questionForm.task,
  session: state.questionForm.session
});

const mapDispatchToProps = dispatch => ({
  submitAnswer: answer => dispatch(actions.submitAnswer(answer))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QuestionForm));
