import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import {Form} from 'semantic-ui-react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import config from 'src/config/config.json';
import {actions} from 'src/components/question-form/actions';

/**
 * Encapsulates validation logic.
 */
class QuestionForm extends Component {
  constructor(props) {
    super(props);
    // this.qs = queryString.parse(props.location.search); // eslint-disable-line react/prop-types
    this.submit = this.submit.bind(this);
  }

  render() {
    return (
      <div>
        <Form onSubmit={this.submit}>{this.props.hasAcceptedHit && this.props.children}</Form>
        <form id="turkForm" method="POST" />
      </div>
    );
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
  answer: state.questionForm.answer
});

const mapDispatchToProps = dispatch => ({
  submitAnswer: answer => dispatch(actions.submitAnswer(answer))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(QuestionForm));
