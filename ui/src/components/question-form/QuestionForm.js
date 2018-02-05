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
      ...this.props.answer,
      ...this.props.session
    };
    this.props.submitAnswer(payload);
  }
}

QuestionForm.propTypes = {
  children: PropTypes.element,

  /** @ignore */
  hasAcceptedHit: PropTypes.bool,
  /** @ignore */
  submitAnswer: PropTypes.func,
  /** @ignore */
  answer: PropTypes.object,
  /** @ignore */
  session: PropTypes.object
};

const mapStateToProps = state => ({
  hasAcceptedHit: state.questionForm.hasAcceptedHit,
  answer: state.questionForm.answer,
  session: state.questionForm.session
});

const mapDispatchToProps = dispatch => ({
  submitAnswer: answer => dispatch(actions.submitAnswer(answer))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QuestionForm));
