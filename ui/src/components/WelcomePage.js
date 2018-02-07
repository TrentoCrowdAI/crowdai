import React from 'react';
import {Grid, Button, Segment, Dimmer, Loader, Message, Icon} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import Instructions from 'src/components/Instructions';
import {actions} from 'src/components/question-form/actions';
import config from 'src/config/config.json';
import RewardWidget from 'src/components/reward-widget/RewardWidget';

class WelcomePage extends React.Component {
  render() {
    return (
      <Grid.Row centered>
        <Instructions />

        {this.props.assigmentStatusLoading && (
          <Segment vertical style={{borderBottom: 0}}>
            <Grid>
              <Grid.Row>
                <Dimmer active inverted>
                  <Loader inverted>Loading</Loader>
                </Dimmer>
              </Grid.Row>
            </Grid>
          </Segment>
        )}

        {this.renderRedirectBtn()}
        {this.renderFinalStep()}
      </Grid.Row>
    );
  }

  renderRedirectBtn() {
    const {assignmentId, hitId, workerId} = this.props.session;

    if (this.props.hasAcceptedHit && this.props.assignmentStatus && !this.props.assignmentStatus.finished) {
      return (
        <Segment>
          <p>Please click on the following button to start. It will open a new window/tab.</p>
          <Button
            onClick={() => this.props.checkPolling()}
            as={Link}
            positive
            to={`/task?assignmentId=${assignmentId}&workerId=${workerId}&hitId=${hitId}`}
            target="_blank">
            Open
          </Button>
        </Segment>
      );
    }
  }

  renderFinalStep() {
    if (this.props.assignmentStatus && this.props.assignmentStatus.finished) {
      return (
        <React.Fragment>
          <Message icon style={{marginTop: 20}}>
            <RewardWidget style={{marginRight: 20}} />
            <Message.Content>
              <Message.Header>Finished</Message.Header>
              <p>Thank you for completing the tasks. Please click the following button to submit your work</p>
              <Button type="button" positive onClick={() => this.submit()}>
                Submit
              </Button>
            </Message.Content>
          </Message>
          <form id="turkForm" method="POST" />
        </React.Fragment>
      );
    }
  }

  submit() {
    const {session} = this.props;
    const url = `${config.mturk[config.mode]}/?assignmentId=${session.assignmentId}`;
    let form = document.getElementById('turkForm');
    form.action = `${url}`;
    form.submit();
  }

  componentDidMount() {
    this.props.checkAssignmentStatus();
  }
}

WelcomePage.propTypes = {
  /** @ignore */
  session: PropTypes.object,
  /** @ignore */
  hasAcceptedHit: PropTypes.bool,
  /** @ignore */
  checkAssignmentStatus: PropTypes.func,
  /** @ignore */
  assignmentStatus: PropTypes.object,
  /** @ignore */
  assigmentStatusLoading: PropTypes.bool,
  /** @ignore */
  checkPolling: PropTypes.func
};

const mapStateToProps = state => ({
  session: state.questionForm.session,
  hasAcceptedHit: state.questionForm.hasAcceptedHit,
  assignmentStatus: state.questionForm.assignmentStatus,
  assigmentStatusLoading: state.questionForm.assigmentStatusLoading
});

const mapDispatchToProps = dispatch => ({
  checkAssignmentStatus: () => dispatch(actions.checkAssignmentStatus()),
  checkPolling: () => dispatch(actions.checkPolling())
});

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);
