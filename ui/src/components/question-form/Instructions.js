import React from 'react';
import {connect} from 'react-redux';
import {Accordion, Header, Segment} from 'semantic-ui-react';
import PropTypes from 'prop-types';

import FileRenderer from 'src/components/core/FileRenderer';

class Instructions extends React.Component {
  state = {open: true};

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    const {open} = this.state;
    const task = this.props.task || {};

    if (this.props.loading || this.finished()) {
      return null;
    }

    return (
      <div>
        <Accordion>
          <Accordion.Title active={open} onClick={this.handleClick}>
            <Header as="h1" style={{display: 'inline'}}>
              Instructions {open ? '(click to collapse)' : '(click to expand)'}
            </Header>
          </Accordion.Title>
          <Accordion.Content active={open}>
            <Segment>
              {task.instructions &&
                task.instructions.map((i, idx) => <FileRenderer key={idx} content={i.content} format={i.format} />)}
            </Segment>
          </Accordion.Content>
        </Accordion>
      </div>
    );
  }

  handleClick() {
    this.setState({open: !this.state.open});
  }

  finished() {
    return (
      (this.props.task && this.props.task.data.finished) ||
      (this.props.assignmentStatus && this.props.assignmentStatus.data.finished)
    );
  }
}

Instructions.propTypes = {
  task: PropTypes.object,
  assignmentStatus: PropTypes.object,
  loading: PropTypes.bool
};

const mapStateToProps = state => ({
  task: state.questionForm.task,
  assignmentStatus: state.questionForm.assignmentStatus,
  loading: state.questionForm.loading
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Instructions);
